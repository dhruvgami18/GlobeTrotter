import api from './api';

export const budgetService = {
  /**
   * Fetch aggregated budget details, calculation breakdown, and over-budget alerts
   */
  getTripBudget: async (tripId) => {
    return api.get(`/trips/${tripId}/budget`);
  },

  /**
   * Fetch all expenses recorded for a trip
   */
  getTripExpenses: async (tripId) => {
    return api.get(`/trips/${tripId}/expenses`);
  },

  /**
   * Add a new expense to a trip
   */
  createExpense: async (tripId, expenseData) => {
    return api.post(`/trips/${tripId}/expenses`, expenseData);
  },

  /**
   * Update an existing expense
   */
  updateExpense: async (expenseId, expenseData) => {
    return api.put(`/expenses/${expenseId}`, expenseData);
  },

  /**
   * Delete an expense
   */
  deleteExpense: async (expenseId) => {
    return api.delete(`/expenses/${expenseId}`);
  },
};

export default budgetService;
