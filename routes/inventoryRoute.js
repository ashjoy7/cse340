const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classification_Id", invController.buildByClassificationId);

// Route to get vehicle details by ID
router.get("/detail/:inv_Id", invController.buildByInvId);

// Route to build inventory management view
router.get("/", invController.buildManagementView);

module.exports = router;
