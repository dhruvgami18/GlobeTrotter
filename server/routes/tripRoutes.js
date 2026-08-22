const express = require('express');
const router = express.Router();
const { getTrips, getTripById, createTrip } = require('../controllers/tripController');
const {
  getTripItinerary,
  addItineraryItem,
  reorderTripItinerary,
} = require('../controllers/itineraryController');
const { getTripBudget } = require('../controllers/budgetController');
const { getTripExpenses, createExpense } = require('../controllers/expenseController');
const { publishTrip, unpublishTrip } = require('../controllers/publicController');
const authMiddleware = require('../middleware/authMiddleware');

// Trip CRUD basics
router.get('/', getTrips);
router.post('/', createTrip);
router.get('/:id', getTripById);

// Member 3 Itinerary Routes
router.get('/:tripId/itinerary', getTripItinerary);
router.post('/:tripId/itinerary', addItineraryItem);
router.put('/:tripId/itinerary/reorder', reorderTripItinerary);

// Member 4 Budget & Expenses Routes
router.get('/:tripId/budget', getTripBudget);
router.get('/:tripId/expenses', getTripExpenses);
router.post('/:tripId/expenses', createExpense);

// Member 4 Publish Routes
router.post('/:id/publish', publishTrip);
router.post('/:id/unpublish', unpublishTrip);

module.exports = router;

