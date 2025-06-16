const { body, validationResult } = require('express-validator');
const userModel = require('../models/userModel');

const validate = {};

validate.userValidationRules = () => [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async value => {
      const existing = await userModel.findOne({ email: value });
      if (existing) return Promise.reject('Email already in use');
    })
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['student', 'staff', 'admin'])
    .withMessage('Invalid role'),
  body('refId').notEmpty().withMessage('refId is required'),
];

validate.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = validate;
