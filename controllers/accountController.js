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
      messages: req.flash('notice')
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
    // Assume some login logic here
    const { email, password } = req.body;

    // Simulate a login failure
    if (email !== 'test@example.com' || password !== 'password') {
      req.flash('notice', 'Invalid email or password.');
      return res.redirect('/account/login');
    }

    // Simulate a successful login
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
      messages: req.flash('notice')
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

// Export all functions
module.exports = { 
  buildLogin, 
  processLogin, 
  buildRegister, 
  registerAccount 
};
