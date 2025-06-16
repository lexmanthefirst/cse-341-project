const { body, validationResult: vr4 } = require('express-validator');

const validateEnroll = {};

validateEnroll.enrollmentValidationRules = () => [
  body('student')
    .notEmpty()
    .withMessage('Student ID is required')
    .isMongoId()
    .withMessage('Invalid student ID'),
  body('course')
    .notEmpty()
    .withMessage('Course ID is required')
    .isMongoId()
    .withMessage('Invalid course ID'),
  body('grade')
    .optional()
    .isIn(['A', 'B', 'C', 'D', 'E', 'F', 'I', 'W', null])
    .withMessage('Invalid grade value'),
  body('status')
    .optional()
    .isIn(['enrolled', 'completed', 'withdrawn'])
    .withMessage('Invalid enrollment status'),
];

validateEnroll.validateRequest = (req, res, next) => {
  const errors = vr4(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = validateEnroll;
