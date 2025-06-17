const { body, validationResult: vr } = require('express-validator');

const validateClass = {};

validateClass.classGroupValidationRules = () => [
  body('name').notEmpty().withMessage('Class name is required'),
  body('level').notEmpty().withMessage('Level is required'),
  body('instructor')
    .optional()
    .isMongoId()
    .withMessage('Instructor must be a valid MongoDB ObjectId'),
];

validateClass.validateRequest = (req, res, next) => {
  const errors = vr(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = validateClass;
