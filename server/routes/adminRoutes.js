const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/adminMiddleware');
const {
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  getAdminTrips,
  deleteAdminTrip,
} = require('../controllers/adminController');

// All admin routes require ADMIN role
router.use(requireAdmin);

// Dashboard statistics & popular rankings
router.get('/stats', getAdminStats);

// User Management
router.get('/users', getAdminUsers);
router.delete('/users/:id', deleteAdminUser);

// Trip Management
router.get('/trips', getAdminTrips);
router.delete('/trips/:id', deleteAdminTrip);

module.exports = router;
