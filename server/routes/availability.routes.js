const express = require('express');
const router = express.Router();

const { getAvailability, setAvailability } = require('../controllers/availability.controller.js');


const { protect } = require('../middleware/auth.middleware.js');
const { admin } = require('../middleware/admin.middleware.js');


// @desc    Get available time slots for a given date and service
// @route   GET /api/availability
// @access  Public
router.get('/', getAvailability);

// @desc    Set or Update the business's working hours
// @route   POST /api/availability
// @access  Private/Admin
router.post('/', protect, admin, setAvailability);

module.exports = router;