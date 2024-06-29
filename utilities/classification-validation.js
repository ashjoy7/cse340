const { body, validationResult } = require('express-validator');
const classificationModel = require('../models/classification-model');

const validate = {};

validate.classificationRules = () => {
  return [
    body('classification_name')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Classification name is required.')
      .matches(/^[a-zA-Z0-9\-_]+$/)
      .withMessage('Classification name cannot contain spaces or special characters.'),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Validation failed
    return res.status(422).json({ errors: errors.array() });
  }
  next(); // Proceed to the next middleware
};

module.exports = validate;