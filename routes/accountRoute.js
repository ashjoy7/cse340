const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');
const regValidate = require('../utilities/account-validation'); // Add this line

// Route to handle "My Account" link click
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to handle login form submission
router.post('/login', utilities.handleErrors(accountController.processLogin));

// Route to handle registration form display
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Route for registration with validation middleware
router.post(
  '/register',
  regValidate.registrationRules(), // Call registrationRules() from account-validation
  regValidate.checkRegData, // Call checkRegData from account-validation
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
