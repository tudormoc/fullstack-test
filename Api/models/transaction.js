const mongoose = require('mongoose');
const softDelete = require('../helpers/softDelete');
const dbFields = require('../helpers/dbFields');
const mongooseHistory = require('../helpers/mongooseHistory');

const { Schema } = mongoose;

// Transaction types for expense/income diary entries
const TRANSACTION_TYPES = ['expense', 'income'];

const schema = Schema(
  {
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true
    },
    category: {
      type: String,
      maxlength: 128,
      trim: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    // Reference to the user who created the transaction
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // Reference to the company the transaction belongs to
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

schema.plugin(softDelete);
schema.plugin(dbFields, {
  fields: {
    // Public: minimal fields for external exposure
    public: ['_id', 'type', 'amount', 'description', 'date', 'createdAt'],
    // Listing: fields shown in list views
    listing: ['_id', 'type', 'amount', 'description', 'category', 'date', 'user', 'createdAt'],
    // Full detail view
    cp: ['_id', 'type', 'amount', 'description', 'category', 'date', 'user', 'company', 'updatedAt', 'createdAt']
  }
});

schema.plugin(
  mongooseHistory({
    mongoose,
    modelName: 'transactions_h',
    userCollection: 'User',
    accountCollection: 'Company',
    userFieldName: 'user',
    accountFieldName: 'company',
    noDiffSaveOnMethods: []
  })
);

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', schema);
