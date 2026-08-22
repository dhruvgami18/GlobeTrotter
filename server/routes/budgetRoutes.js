const express = require('express');
const router = express.Router({ mergeParams: true });
const { getTripBudget } = require('../controllers/budgetController');

// GET /api/trips/:tripId/budget
router.get('/', getTripBudget);

module.exports = router;
