module.exports = {
  type: 'object',
  properties: {
    _id: { type: 'string', readOnly: true },
    name: { type: 'string', example: 'SS1 A' },
    level: { type: 'string', example: '100' },
    instructor: {
      type: 'string',
      format: 'objectId',
      description: 'ID of the instructor (staff user)',
      readOnly: true,
      example: '60f6e9f2b7a1c142d8ef8c12',
    },
    createdAt: { type: 'string', format: 'date-time', readOnly: true },
    updatedAt: { type: 'string', format: 'date-time', readOnly: true },
  },
  required: ['name', 'level', 'instructor'],
};
