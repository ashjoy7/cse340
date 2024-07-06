const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const utilities = require('../utilities/index');
const accountModel = require("../models/account-model");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    req.flash("notice", "This is a flash message.");
    res.render('account/login', {
      title: 'Login',
      nav,
      messages: req.flash('notice'),
      errors: [],
      account_email: req.body.account_email || '' 
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process login attempt
 * *************************************** */
async function processLogin(req, res, next) {
  try {
    const { account_email, account_password } = req.body;

    console.log('Received login attempt:', account_email); // Debugging: Check if email is received

    // Retrieve user by email
    const user = await accountModel.checkExistingEmail(account_email);

    console.log('Retrieved user:', user); // Debugging: Check if user is retrieved

    // Check if user exists and compare passwords
    if (!user || !account_password || !user.account_password) {
      console.log('Invalid email or password.'); // Debugging: Log invalid case
      req.flash('notice', 'Invalid email or password.');
      return res.render('account/login', {
        title: 'Login',
        nav: await utilities.getNav(),
        messages: req.flash('notice'),
        errors: [],
        account_email
      });
    }

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(account_password, user.account_password);

    console.log('Password match:', passwordMatch); // Debugging: Check password comparison result

    if (!passwordMatch) {
      console.log('Invalid email or password.'); // Debugging: Log incorrect password case
      req.flash('notice', 'Invalid email or password.');
      return res.render('account/login', {
        title: 'Login',
        nav: await utilities.getNav(),
        messages: req.flash('notice'),
        errors: [],
        account_email
      });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ id: user.account_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    console.log('Generated access token:', accessToken); // Debugging: Check generated token

    // Set JWT token in cookie
    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600 * 1000 // 1 hour
    };
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true; // Set secure cookie in production
    }
    res.cookie('jwt', accessToken, cookieOptions);

    console.log('Setting JWT token in cookie:', accessToken); // Debugging: Check if token is set in cookie

    // Redirect after successful login
    req.flash('notice', 'Successfully logged in!');
    console.log('Redirecting to /account'); // Debugging: Check if redirect is attempted
    res.redirect('/account');

  } catch (error) {
    next(error); // Pass error to Express error handler
  }
}


/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    req.flash("notice", "This is a flash message.");
    res.render('account/register', {
      title: 'Register',
      nav,
      messages: req.flash('notice'),
      errors: [], 
      account_firstname: '', 
      account_lastname: '', 
      account_email: ''
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Deliver Account Management or Admin view
 * *************************************** */
async function accountManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    req.flash("notice", "This is a flash message.");
    res.render('account/admin-view', {
      title: 'Account Management',
      nav,
      errors: null
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res, next) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  let nav = await utilities.getNav();

  try {
    const errors = validationResult(req); // Validate input data

    if (!errors.isEmpty()) {
      return res.render('account/register', {
        title: 'Registration',
        nav,
        errors: errors.array(),
        account_firstname,
        account_lastname,
        account_email
      });
    }

    const existingUser = await accountModel.checkExistingEmail(account_email);
    if (existingUser) {
      req.flash("notice", "Email already registered.");
      return res.redirect('/account/register');
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(account_password, 10);
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.');
      return res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: [],
        account_firstname,
        account_lastname,
        account_email
      });
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: [],
        account_email: ''
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: [],
        account_firstname,
        account_lastname,
        account_email
      });
    }
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
}

/* ****************************************
 *  Process edit view
 * ************************************ */
async function editLoginInfo(req, res) {
  let nav = await utilities.getNav();
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
}

/* ****************************************
 *  Process update information request
 * ************************************ */
async function editInformation(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  const accountData = await accountModel.getAccountById(account_id);

  const updateInformation = await accountModel.updateInformation(account_firstname, account_lastname, account_email, account_id);

  if (updateInformation) {
    req.flash("notice", `Congratulations, ${account_firstname}. You have updated your account.`);
    res.clearCookie("jwt");

    const updatedInformation = await accountModel.getAccountById(account_id);
    delete updatedInformation.account_password;

    const accessToken = jwt.sign(updatedInformation.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });

    if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
    }

    res.status(201).redirect("/account");
  } else {
    req.flash("notice", "Sorry, the account update failed.");
    res.status(501).render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }
}

/* ****************************************
 *  Process password edit request
 * ************************************ */
async function editPassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;
  const hashedPassword = await bcrypt.hash(account_password, 10);
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (updateResult) {
    req.flash("notice", "Congratulations, your password has been updated.");
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the password update failed.");
    const accountData = await accountModel.getAccountById(account_id);
    res.status(501).render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }
}

module.exports = {
  buildLogin,
  processLogin,
  buildRegister,
  accountManagement,
  registerAccount,
  accountLogout,
  editLoginInfo,
  editInformation,
  editPassword,
};
