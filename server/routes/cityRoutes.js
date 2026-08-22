const express = require('express');
const router = express.Router();
const { getCities, getCityById } = require('../controllers/cityController');

router.get('/', getCities);
router.get('/:id', getCityById);

module.exports = router;
