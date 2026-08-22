const prisma = require('../config/database');

const VALID_CATEGORIES = ['TRANSPORT', 'STAY', 'ACTIVITY', 'MEAL', 'MISCELLANEOUS'];

/**
 * GET /api/trips/:tripId/expenses
 * Returns all expense records for a trip.
 */
async function getTripExpenses(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    if (isNaN(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: [{ date: 'asc' }, { createdAt: 'desc' }],
    });

    res.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/trips/:tripId/expenses
 * Create a new expense for a trip.
 */
async function createExpense(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    if (isNaN(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const { category, description, amount, date } = req.body;

    if (!description || amount === undefined || amount === null || !date) {
      return res.status(400).json({
        success: false,
        message: 'Description, amount, and date are required.',
      });
    }

    const upperCategory = (category || 'MISCELLANEOUS').toUpperCase();
    if (!VALID_CATEGORIES.includes(upperCategory)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a non-negative number.',
      });
    }

    // Verify trip exists
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const expense = await prisma.expense.create({
      data: {
        tripId,
        category: upperCategory,
        description: description.trim(),
        amount: parsedAmount,
        date: date.trim(),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/expenses/:id
 * Update an existing expense.
 */
async function updateExpense(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid expense ID' });
    }

    const { category, description, amount, date } = req.body;

    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const updateData = {};

    if (category) {
      const upperCategory = category.toUpperCase();
      if (!VALID_CATEGORIES.includes(upperCategory)) {
        return res.status(400).json({
          success: false,
          message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
        });
      }
      updateData.category = upperCategory;
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a non-negative number.',
        });
      }
      updateData.amount = parsedAmount;
    }

    if (date) {
      updateData.date = date.trim();
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/expenses/:id
 * Delete an expense.
 */
async function deleteExpense(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid expense ID' });
    }

    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    await prisma.expense.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTripExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
