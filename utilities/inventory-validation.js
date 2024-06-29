const { body, validationResult } = require('express-validator');
const validate = {};

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // Make is required
    body('inv_make')
      .trim()
      .notEmpty()
      .withMessage('Make is required.'),

    // Model is required
    body('inv_model')
      .trim()
      .notEmpty()
      .withMessage('Model is required.'),

    // Year is required and must be a valid 4-digit number
    body('inv_year')
      .trim()
      .isNumeric()
      .isLength({ min: 4, max: 4 })
      .withMessage('Year must be a valid 4-digit number.'),

    // Price is required and must be a valid number
    body('inv_price')
      .trim()
      .isNumeric()
      .notEmpty()
      .withMessage('Price must be a valid number.'),

    // Classification is required
    body('classification_id')
      .trim()
      .notEmpty()
      .withMessage('Classification is required.'),

    // Image path is required
    body('inv_image_path')
      .trim()
      .notEmpty()
      .withMessage('Image path is required.'),

    // Thumbnail path is required
    body('inv_thumbnail_path')
      .trim()
      .notEmpty()
      .withMessage('Thumbnail path is required.'),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Handle validation errors
    return res.status(422).json({ errors: errors.array() });
  }
  next(); // Proceed to the next middleware
};

module.exports = validate;
