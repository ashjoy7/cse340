const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');
const regValidate = require('../utilities/account-validation');

// Route to handle "My Account" link click
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to handle login form submission
router.post('/login', regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.processLogin));

// Route to handle registration form display
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Route for registration with validation middleware
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Route to build account view
router.get('/', utilities.checkLoginData, utilities.handleErrors(accountController.accountManagement));

// Process logout attempt
router.get('/logout', utilities.handleErrors(accountController.processLogout));

// Route to process account edit view
router.get('/edit-account/:account_id', utilities.handleErrors(accountController.editLoginInfo));

// Route to process account edit information
router.post('/edit-information', utilities.handleErrors(accountController.editInformation));

// Route to process account edit password
router.post('/edit-password', regValidate.loginRules(), utilities.handleErrors(accountController.editPassword));

module.exports = router;
