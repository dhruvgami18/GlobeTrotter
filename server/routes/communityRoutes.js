const express = require('express');
const router = express.Router();
const { getCommunityTrips } = require('../controllers/communityController');

// GET /api/community/trips
router.get('/trips', getCommunityTrips);

module.exports = router;
