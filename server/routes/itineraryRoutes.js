const express = require('express');
const router = express.Router();
const {
  updateItineraryItem,
  deleteItineraryItem,
} = require('../controllers/itineraryController');

// Routes mounted at /api/itinerary
router.put('/:id', updateItineraryItem);
router.delete('/:id', deleteItineraryItem);

module.exports = router;
