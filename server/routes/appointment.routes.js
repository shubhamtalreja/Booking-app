const express = require('express');
const router = express.Router();

const {
    createAppointment,
    getMyAppointments,
    getAllAppointments
} = require('../controllers/appointment.controller')

const { admin } = require('../middleware/admin.middleware');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createAppointment);

router.get('/me', protect, getMyAppointments);

router.get('/', protect, admin, getAllAppointments);

module.exports = router;