const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  deleteAccount,
  getSavedDestinations,
  addSavedDestination,
  removeSavedDestination,
} = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// All profile routes require authentication
router.use(authMiddleware);

router.get('/', getProfile);
router.put('/', updateProfile);
router.delete('/', deleteAccount);

router.get('/saved-destinations', getSavedDestinations);
router.post('/saved-destinations', addSavedDestination);
router.delete('/saved-destinations/:cityId', removeSavedDestination);

module.exports = router;
