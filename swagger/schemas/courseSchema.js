module.exports = {
  type: 'object',
  properties: {
    _id: { type: 'string', readOnly: true },
    title: { type: 'string', example: 'Algebra 101' },
    description: { type: 'string', example: 'Introductory algebra course' },
    department: { type: 'string', example: '60f6e9f2b7a1c142d8ef8c11' },
    instructor: { type: 'string', example: '60f6e9f2b7a1c142d8ef8c12' },
    createdAt: { type: 'string', format: 'date-time', readOnly: true },
    updatedAt: { type: 'string', format: 'date-time', readOnly: true },
  },
  required: ['title', 'department', 'instructor'],
};
