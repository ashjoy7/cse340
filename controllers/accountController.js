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
      errors: null,
      account_email: '' // Initialize account_email as empty string or fetch from req.body
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
    // Example: Check credentials against a database
    const user = await accountModel.findByEmail(account_email);

    if (!user || user.account_password !== account_password) {
      req.flash('notice', 'Invalid email or password.');
      return res.redirect('/account/login');
    }

    // Set session or token for authenticated user
    req.session.user = user; // Example assuming you use Express session
    req.flash('notice', 'Successfully logged in!');
    res.redirect('/');
  } catch (error) {
    next(error); // Pass the error to Express error handler
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
      errors: null // Ensure errors is initialized as null
    });
  } catch (error) {
    next(error); // Pass the error to Express error handler
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await accountModel.findByEmail(account_email);
    if (existingUser) {
      req.flash("notice", "Email already registered.");
      return res.redirect('/account/register');
    }

    // Register new account
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null // Ensure errors is initialized as null
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
