const Transaction = require('../models/transaction');

// RBAC helper for transaction access control
// Transactions are scoped to the user's company
const transactionRbac = async (caller, resourceId) => {
  const transaction = await Transaction.findById(resourceId);
  if (!transaction) return null;

  const { roles: globalRoles, company: userCompany = {} } = caller;
  const { roles: companyRoles = [] } = userCompany;
  const roles = Array.from(new Set([...companyRoles, ...globalRoles]));

  // Superusers can access any transaction
  if (roles.includes('superuser')) return transaction;

  // Users can only access transactions within their company
  if (userCompany?.id?.toString() === transaction.company?.toString()) return transaction;

  return false;
};

// Any user in the same company can view a transaction
module.exports.canGetTransaction = (caller, resourceId) => transactionRbac(caller, resourceId);

// Only the creator or an admin can update a transaction
module.exports.canUpdateTransaction = async (caller, resourceId) => {
  const transaction = await transactionRbac(caller, resourceId);
  if (!transaction) return transaction; // null or false

  // Admins can update any transaction in their company
  const { roles: globalRoles, company: userCompany = {} } = caller;
  const { roles: companyRoles = [] } = userCompany;
  const roles = Array.from(new Set([...companyRoles, ...globalRoles]));
  if (roles.includes('superuser') || roles.includes('admin')) return transaction;

  // Regular users can only update their own transactions
  if (caller.id?.toString() === transaction.user?.toString()) return transaction;

  return false;
};

// Only the creator or an admin can delete a transaction
module.exports.canDeleteTransaction = (caller, resourceId) =>
  module.exports.canUpdateTransaction(caller, resourceId);
