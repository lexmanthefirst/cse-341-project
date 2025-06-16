module.exports = {
  type: 'object',
  properties: {
    _id: { type: 'string', readOnly: true },
    name: { type: 'string', example: 'SS1 A' },
    section: { type: 'string', example: 'Science' },
    createdAt: { type: 'string', format: 'date-time', readOnly: true },
    updatedAt: { type: 'string', format: 'date-time', readOnly: true },
  },
  required: ['name', 'section'],
};
