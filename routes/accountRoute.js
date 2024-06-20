// Needed Resources
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');

// Route to handle "My Account" link click
router.get('/login', utilities.asyncMiddleware(accountController.buildLogin));

// Export the router for use in server.js
module.exports = router;
