const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

/*********************************
 *   Deliver login view
 *********************************/

async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      account_email: '', // Initialize account_email to an empty string
    });
  } catch (error) {
    next(error);
  }
}

/*********************************
 *   Deliver registration view
 *********************************/

async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/*********************************
 *   Process Registration
 *********************************/

async function registerAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash(
        "notice",
        `Thanks for registering, ${account_firstname}! Please log in.`
      );
      // Redirect to login page after registration
      return res.redirect("/account/login");
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("account/register", {
        title: "Registration",
        nav,
      });
    }
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    res.status(500).render("account/register", {
      title: "Registration",
      nav: await utilities.getNav(),
      errors: null,
    });
  }
}


/*********************************
 *   Process login request
 *********************************/

async function processLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;

    // Fetch account data by email
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData || !(await bcrypt.compare(account_password, accountData.account_password))) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

    delete accountData.account_password; // Remove sensitive data from response

    // Generate JWT token
    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 } // Token expires in 1 hour
    );

    // Configure cookie options
    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600 * 1000, // 1 hour
    };

    // Secure cookies in production environment
    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }

    // Set JWT token in cookie
    res.cookie("jwt", accessToken, cookieOptions);
    res.redirect("/account/"); // Redirect to account management page
  } catch (error) {
    next(error);
  }
}

/*********************************
 *   Deliver Account Management view
 *********************************/

async function accountManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const additional = await utilities.getAdditional(res.locals.accountData.account_type);

    res.render("account/accountManagement", {
      title: `Welcome ${res.locals.accountData.account_firstname}`,
      additional,
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/*********************************
 *   Deliver Account Update view
 *********************************/

async function buildAccountupdate(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const accountData = res.locals.accountData;

    res.render("account/update", {
      title: "Account update",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_email: accountData.account_email,
      account_lastname: accountData.account_lastname,
      account_firstname: accountData.account_firstname,
    });
  } catch (error) {
    next(error);
  }
}

async function updateAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_id } = req.body;
    const updateResult = await accountModel.updateAccount({
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
      // Rebuild the JWT with new data delete 
      updateResult.account_password; 
      const accessToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: 3600 * 1000, }); 
        res.cookie("jwt", accessToken, 
        { httpOnly: true, maxAge: 3600 * 1000 }
        );
    if (updateResult) {
      const accountName = `${updateResult.account_firstname} ${updateResult.account_lastname}`;
      req.flash("notice", `${accountName} was successfully updated.`);
      res.redirect("/account/update");

    } else {
      const accountName = `${account_firstname} ${account_lastname}`;
      req.flash("notice", "Sorry, the update failed.");
      res.status(501).render("/account/update", {  // Assuming "updateAccount" is the correct path
        title: `Update ${accountName}`,
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
      });
    }
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
}

async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;
  let hashedPassword;
  
  try {

    // Hashing the password asynchronously
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    return res.status(500).render("account/update", {
      title: "Account Update",
      nav,
      errors: null,
    });
  }

  try {
    await accountModel.updatePassword(
      hashedPassword,
      account_id,
    );
  } catch (error) {
    const accountName = `${res.locals.accountData.account_firstname} ${res.locals.accountData.account_lastname}`;
    req.flash("notice", "Sorry, the password update failed.");
    return res.status(501).render("/account/update", {
      title: "Update " + accountName,
      nav,
      errors: null,
      account_id,
    });
  }
  const accountName = `${res.locals.accountData.account_firstname} ${res.locals.accountData.account_lastname}`;
  req.flash("notice", `${accountName} successfully updated password.`);
  res.redirect("/account/update");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  processLogin,
  accountManagement,
  updateAccount,
  updatePassword,
  buildAccountupdate,
};