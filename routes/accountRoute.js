const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');

// Route to handle "My Account" link click
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to handle login form submission
router.post('/login', utilities.handleErrors(accountController.processLogin));

// Route to handle registration
router.get('/register', utilities.handleErrors(accountController.buildRegister));

router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;
