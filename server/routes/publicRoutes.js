const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  publishTrip,
  unpublishTrip,
  getPublicTrip,
  copyPublicTrip,
} = require('../controllers/publicController');

// Public Trip Read-only
router.get('/trips/:shareToken', getPublicTrip);

// Deep-copy public trip into logged in user's account
router.post('/trips/:shareToken/copy', authMiddleware, copyPublicTrip);

// Publishing endpoints (can be called via /api/public or /api/trips)
router.post('/trips/:id/publish', authMiddleware, publishTrip);
router.post('/trips/:id/unpublish', authMiddleware, unpublishTrip);

module.exports = router;
