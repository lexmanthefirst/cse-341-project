const { body, validationResult: vr3 } = require('express-validator');

const validateCourse = {};

validateCourse.courseValidationRules = () => [
  body('title').notEmpty().withMessage('Course title is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('department')
    .notEmpty()
    .withMessage('Department ID is required')
    .isMongoId()
    .withMessage('Invalid department ID'),
  body('instructor')
    .notEmpty()
    .withMessage('instructor ID is required')
    .isMongoId()
    .withMessage('Invalid instructor ID is required'),
  body('creditsUnits')
    .optional()
    .isInt({ min: 1, max: 6 })
    .withMessage('Credits must be an integer between 1 and 6'),
];

validateCourse.validateRequest = (req, res, next) => {
  const errors = vr3(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = validateCourse;
