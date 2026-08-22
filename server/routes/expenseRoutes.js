const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getTripExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

// Trip-scoped endpoints: /api/trips/:tripId/expenses
router.get('/', getTripExpenses);
router.post('/', createExpense);

// Expense-specific endpoints: /api/expenses/:id (or /api/trips/:tripId/expenses/:id)
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
