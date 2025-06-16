const { body, validationResult: vr2 } = require('express-validator');

const validateDept = {};

validateDept.departmentValidationRules = () => [
  body('name').notEmpty().withMessage('Department name is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
];

validateDept.validateRequest = (req, res, next) => {
  const errors = vr2(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = validateDept;
