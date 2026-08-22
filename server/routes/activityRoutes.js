const express = require('express');
const router = express.Router();
const { getActivities, getActivityById } = require('../controllers/activityController');

router.get('/', getActivities);
router.get('/:id', getActivityById);

module.exports = router;
