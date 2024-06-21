const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');

// Route to handle "My Account" link click
router.get('/login', utilities.asyncMiddleware(accountController.buildLogin));

// Route to handle login form submission
router.post('/login', utilities.asyncMiddleware(accountController.processLogin));

// Route to handle registration
router.get('/register', utilities.asyncMiddleware(accountController.buildRegister));

module.exports = router;
