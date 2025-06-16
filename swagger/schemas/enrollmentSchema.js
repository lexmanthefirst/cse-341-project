module.exports = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
      readOnly: true,
    },
    student: {
      type: 'string',
      example: '60f6e9f2b7a1c142d8ef8c10',
    },
    course: {
      type: 'string',
      example: '60f6e9f2b7a1c142d8ef8c11',
    },
    enrolledAt: {
      type: 'string',
      format: 'date-time',
      example: '2025-01-10T12:00:00Z',
    },
    grade: {
      type: 'string',
      enum: ['A', 'B', 'C', 'D', 'E', 'F', 'I', 'W', null],
      example: 'A',
    },
    status: {
      type: 'string',
      enum: ['enrolled', 'completed', 'withdrawn'],
      example: 'enrolled',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      readOnly: true,
    },
  },
  required: ['student', 'course'],
};
