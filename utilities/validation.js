const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}


validate.regRules = () => {
    return [
      // classification is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .withMessage("Please provide a classification with only letters.") // on error this message is sent.
        .isLength({ min: 2 })
        .withMessage("Please provide a classification."), // on error this message is sent.
    ]
  }

  validate.checkData = async (req, res, next) => {
        const { classification_name } = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "AddClassification",
            errors,
            nav,
            classification_name
        })
        } else {
        next()
        }
    }
    validate.invRules = () => {
      return [
        body('inv_make').trim().isAlphanumeric().withMessage('Make must only contain letters and numbers'),
        body('inv_model').trim().isAlphanumeric().withMessage('Model must only contain letters and numbers'),
        body('inv_year').trim().isInt({ min: 1886, max: 2099 }).withMessage('Year must be an integer between 1886 and 2099'),
        body('inv_description').trim().isLength({ min: 1 }).withMessage('Description is required'),
        body('inv_image').trim().isLength({ min: 1 }).withMessage('Image is required'),
        body('inv_thumbnail').trim().isLength({ min: 1 }).withMessage('Thumbnail is required'),
        body('inv_price').trim().isInt({ min: 0 }).withMessage('Price must be an integer greater than or equal to 0'),
        body('inv_miles').trim().isInt({ min: 0 }).withMessage('Miles must be an integer greater than or equal to 0'),
        body('inv_color').trim().isAlpha().withMessage('Color must only contain letters'),
      ];
    };
    

validate.invCheck = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();
  if (!errors.isEmpty()) {
    
    res.render('inventory/add-inventory', {
      title: 'AddInventory',
      errors: errors.array(),
      nav,
      invData: req.body,
    });
  } else {
    next();
  }
};

validate.updateCheck = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();
  if (!errors.isEmpty()) {
    
    res.render('inventory/edit-inventory', {
      title: 'EditInventory',
      errors: errors.array(),
      nav,
      invData: req.body,
      inv_id
    });
  } else {
    next();
  }
};


module.exports = validate;