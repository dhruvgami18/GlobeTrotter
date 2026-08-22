const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  addTripStop,
  publishTrip,
} = require('../controllers/tripController');
const {
  getTripItinerary,
  addItineraryItem,
  reorderTripItinerary,
} = require('../controllers/itineraryController');

// Trip CRUD
router.get('/', getTrips);
router.post('/', createTrip);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.post('/:id/publish', publishTrip);

// Trip Stops
router.post('/:tripId/stops', addTripStop);

// Trip Itinerary
router.get('/:tripId/itinerary', getTripItinerary);
router.post('/:tripId/itinerary', addItineraryItem);
router.put('/:tripId/itinerary/reorder', reorderTripItinerary);

module.exports = router;
