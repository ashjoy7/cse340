// Needed Resources
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');

// Route to handle "My Account" link click
router.get('/my-account', utilities.handleErrors(accountController.myAccount));

// Export the router for use in server.js
module.exports = router;
