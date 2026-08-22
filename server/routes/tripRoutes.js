const express = require('express');
const router = express.Router();
const { getTrips, getTripById, createTrip } = require('../controllers/tripController');
const {
  getTripItinerary,
  addItineraryItem,
  reorderTripItinerary,
} = require('../controllers/itineraryController');

// Trip CRUD basics
router.get('/', getTrips);
router.post('/', createTrip);
router.get('/:id', getTripById);

// Member 3 Itinerary Routes
router.get('/:tripId/itinerary', getTripItinerary);
router.post('/:tripId/itinerary', addItineraryItem);
router.put('/:tripId/itinerary/reorder', reorderTripItinerary);

module.exports = router;
