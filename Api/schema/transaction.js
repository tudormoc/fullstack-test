// AJV validation schemas for transaction CRUD operations
module.exports = {
  createTransaction: {
    $id: 'createTransaction',
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['expense', 'income'] },
      amount: { type: 'number', minimum: 0.01 },
      description: { type: 'string', maxLength: 500 },
      category: { type: 'string', maxLength: 128 },
      date: { type: 'string', format: 'date-time' }
    },
    required: ['type', 'amount'],
    additionalProperties: false
  },
  updateTransaction: {
    $id: 'updateTransaction',
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['expense', 'income'] },
      amount: { type: 'number', minimum: 0.01 },
      description: { type: 'string', maxLength: 500 },
      category: { type: 'string', maxLength: 128 },
      date: { type: 'string', format: 'date-time' }
    },
    additionalProperties: false
  }
};
