const Transaction = require('../models/transaction');
const { SendData, ServerError, NotFound, Unauthorized } = require('../helpers/response');
const getter = require('../helpers/getter');
const { canGetTransaction, canUpdateTransaction, canDeleteTransaction } = require('../rbac/transactions');

// List transactions for the user's company, with optional type/category filters
module.exports.get = async (req, res, next) => {
  try {
    const { filter, type, category } = req.query;
    const { companyId } = req.params;
    const query = { company: companyId };

    if (filter) query.description = new RegExp(filter, 'i');
    if (type) query.type = type;
    if (category) query.category = new RegExp(category, 'i');

    const data = await getter(Transaction, query, req, res);

    return next(SendData(data));
  } catch (err) {
    return next(ServerError(err));
  }
};

// Create a new transaction linked to the authenticated user and their company
module.exports.create = async (req, { locals: { user } }, next) => {
  try {
    const data = new Transaction({
      ...req.body,
      user: user.id,
      company: req.params.companyId
    });

    data.__history = {
      user: user.id,
      company: req.params.companyId,
      event: 'create',
      method: 'create'
    };

    await data.save();

    return next(SendData(data.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

// Get a single transaction by ID
module.exports.getById = async ({ params: { id } }, { locals: { user } }, next) => {
  try {
    const transaction = await canGetTransaction(user, id);
    if (transaction === null) return next(NotFound());
    if (!transaction) return next(Unauthorized());

    return next(SendData(transaction.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

// Update a transaction (only owner or admin)
module.exports.update = async ({ params: { id }, body }, { locals: { user } }, next) => {
  try {
    const transaction = await canUpdateTransaction(user, id);
    if (transaction === null) return next(NotFound());
    if (!transaction) return next(Unauthorized());

    const data = Object.assign(transaction, body);

    data.__history = {
      event: 'update',
      method: 'patch',
      user: user.id,
      company: user.company.id
    };

    await data.save();

    return next(SendData(transaction.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

// Soft-delete a transaction (only owner or admin)
module.exports.delete = async ({ params: { id } }, { locals: { user } }, next) => {
  try {
    const transaction = await canDeleteTransaction(user, id);
    if (transaction === null) return next(NotFound());
    if (!transaction) return next(Unauthorized());

    transaction.__history = {
      event: 'delete',
      method: 'delete',
      user: user.id,
      company: user.company.id
    };

    await transaction.softDelete();

    return next(SendData({ message: 'Transaction deleted successfully' }));
  } catch (err) {
    return next(ServerError(err));
  }
};
