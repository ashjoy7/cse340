const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator"); // Import validationResult
const utilities = require('../utilities/index');
const accountModel = require("../models/account-model");

const accountController = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render('account/login', {
      title: 'Login',
      nav,
      messages: req.flash('notice'),
      errors: [],
      account_email: '' // Initialize account_email as an empty string
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

    // Implement actual login logic using your accountModel or other authentication strategy
    const user = await accountModel.findByEmail(account_email);

    if (!user || !bcrypt.compareSync(account_password, user.account_password)) {
      req.flash('notice', 'Invalid email or password.');
      return res.render('account/login', {
        title: 'Login',
        nav: await utilities.getNav(),
        messages: req.flash('notice'),
        errors: [], // Add any specific errors here if needed
        account_email // Keep the entered email in case of error
      });
    }

    // Set session or token for authenticated user
    req.session.user = user;
    req.flash('notice', 'Successfully logged in!');
    res.redirect('/');
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render('account/register', {
      title: 'Register',
      nav,
      messages: req.flash('notice'),
      errors: [], // Ensure errors is initialized as empty array if not needed
      account_firstname: '', // Initialize account_firstname as empty string or fetch from req.body
      account_lastname: '', // Initialize account_lastname as empty string or fetch from req.body
      account_email: '' // Initialize account_email as empty string or fetch from req.body
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
        errors: errors.array(), // Pass validation errors to the view
        account_firstname,
        account_lastname,
        account_email
      });
    }

    // Check if email already exists
    const existingUser = await accountModel.checkExistingEmail(account_email);
    if (existingUser) {
      req.flash("notice", "Email already registered.");
      return res.redirect('/account/register');
    }

    // Hash the password before storing
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.');
      return res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: [], // Ensure errors is defined as an empty array
        account_firstname,
        account_lastname,
        account_email
      });
    }

    // Register new account
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword // Pass hashed password to the model function
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: [], // Ensure errors is defined as an empty array
        account_email: '' // Initialize account_email as an empty string for the login form
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: [], // Ensure errors is initialized as null
        account_firstname,
        account_lastname,
        account_email
      });
    }
  } catch (error) {
    next(error); // Pass the error to Express error handler
  }
}

module.exports = { 
  buildLogin, 
  processLogin, 
  buildRegister, 
  registerAccount 
};
