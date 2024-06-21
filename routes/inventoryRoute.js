const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const { body } = require('express-validator')

// Route to build inventory by classification view
router.get("/type/:classification_Id", invController.buildByClassificationId);

// Route to get vehicle details by ID
router.get("/detail/:inv_Id", invController.buildByInvId);

// Route to build inventory management view
router.get("/", invController.buildManagementView);

// Route to deliver add-classification view
router.get('/add-classification', invController.buildAddClassification);

// Route to process adding a new classification
router.post('/add-classification', [
    body('classification_name').trim().not().isEmpty().withMessage('Classification name is required.')
], invController.processAddClassification);

module.exports = router;
