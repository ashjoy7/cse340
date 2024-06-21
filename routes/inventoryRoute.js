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

// Route to deliver add-inventory view
router.get('/add-inventory', invController.buildAddInventory);

// Route to process adding a new inventory item
router.post('/add-inventory', [
    body('inv_make').trim().not().isEmpty().withMessage('Make is required.'),
    body('inv_model').trim().not().isEmpty().withMessage('Model is required.'),
    body('inv_year').trim().isNumeric().withMessage('Year must be a valid number.'),
    body('inv_price').trim().isNumeric().withMessage('Price must be a valid number.'),
    body('classification_id').trim().not().isEmpty().withMessage('Classification is required.'),
    body('inv_image_path').trim().not().isEmpty().withMessage('Image path is required.'),
    body('inv_thumbnail_path').trim().not().isEmpty().withMessage('Thumbnail path is required.')
], invController.processAddInventory);

module.exports = router;
