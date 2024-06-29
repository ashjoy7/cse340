const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController'); // replace with the actual path to your file
const utilities = require("../utilities/");
const validate = require('../utilities/validation');

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);


router.get("/", invController.buildManager);


router.get("/add-classification", invController.buildAddClassification);
router.get("/add-inventory", invController.buildAddInventory);


router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));


router.post(
    '/add-inventory',
    validate.invRules(),
    validate.invCheck,
    utilities.handleErrors(invController.addInventory)
);

router.post(
    '/add-classification',
    validate.regRules(),
    validate.checkData,
    utilities.handleErrors(invController.addClassification)
);


router.post(
    '/edit-inventory',
    validate.updateCheck,
    utilities.handleErrors(invController.editInventory)
);
module.exports = router;