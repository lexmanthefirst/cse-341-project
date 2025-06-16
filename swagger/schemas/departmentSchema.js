module.exports = {
  type: 'object',
  properties: {
    _id: { type: 'string', readOnly: true },
    name: { type: 'string', example: 'Mathematics' },
    description: { type: 'string', example: 'Handles all mathematics courses' },
    createdAt: { type: 'string', format: 'date-time', readOnly: true },
    updatedAt: { type: 'string', format: 'date-time', readOnly: true },
  },
  required: ['name'],
};
