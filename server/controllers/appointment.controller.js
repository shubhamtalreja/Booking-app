const Appointment = require('../models/appointment.model');
const Service = require('../models/service.model');
const Availability = require('../models/availability.model');
const { parseISO, addMinutes } = require('date-fns');
const { default: mongoose } = require('mongoose');


// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { serviceId, startTime } = req.body;
        const clientId = req.user.id; // Reliably get the user ID from the protect middleware

        // --- 1. Basic Input Validation ---
        if (!serviceId || !startTime) {
            return res.status(400).json({ success: false, message: 'Service ID and start time are required.' });
        }

        const proposedStartTime = parseISO(startTime);

        // --- 2. Fetch All Necessary Data in Parallel ---
        const [service, availability, existingAppointments] = await Promise.all([
            Service.findById(serviceId).session(session),
            Availability.findOne().session(session),
            Appointment.find({
                startTime: {
                    $gte: startOfDay(proposedStartTime),
                    $lt: endOfDay(proposedStartTime),
                },
                status: 'confirmed',
            }).session(session),
        ]);

        // --- 3. Run a Gauntlet of Validation Checks ---

        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found.' });
        }

        if (!availability) {
            return res.status(400).json({ success: false, message: 'Booking is not possible, as business hours have not been set.' });
        }

        const proposedEndTime = addMinutes(proposedStartTime, service.duration);

        // Check 3a: Is the business open on this day of the week?
        const dayOfWeekIndex = getDay(proposedStartTime);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const daySchedule = availability.weeklyAvailability.find(d => d.dayOfWeek === days[dayOfWeekIndex]);

        if (!daySchedule || !daySchedule.isAvailable) {
            return res.status(400).json({ success: false, message: 'The business is closed on the selected day.' });
        }

        // Check 3b: Is this a specific non-working day (holiday)?
        const isHoliday = availability.nonWorkingDays.some(
            holiday => startOfDay(new Date(holiday)).getTime() === startOfDay(proposedStartTime).getTime()
        );
        if (isHoliday) {
            return res.status(400).json({ success: false, message: 'The business is closed for a holiday on the selected date.' });
        }

        // Check 3c: Is the proposed time within the working hours?
        const [startHour, startMinute] = daySchedule.startTime.split(':').map(Number);
        const [endHour, endMinute] = daySchedule.endTime.split(':').map(Number);
        const workingDayStart = setMilliseconds(setSeconds(setMinutes(setHours(startOfDay(proposedStartTime), startHour), startMinute), 0), 0);
        const workingDayEnd = setMilliseconds(setSeconds(setMinutes(setHours(startOfDay(proposedStartTime), endHour), endMinute), 0), 0);

        if (isBefore(proposedStartTime, workingDayStart) || isAfter(proposedEndTime, workingDayEnd)) {
            return res.status(400).json({ success: false, message: 'The selected time is outside of business hours.' });
        }

        // Check 3d: Does the proposed time conflict with an existing appointment?
        for (const appointment of existingAppointments) {
            if (isBefore(proposedStartTime, appointment.endTime) && isBefore(appointment.startTime, proposedEndTime)) {
                // If a conflict is found, throw a specific error.
                const conflictError = new Error('This time slot is no longer available. Please select another time.');
                conflictError.statusCode = 409; // Attach a status code to the error
                throw conflictError;
            }
        }

        const newAppointment = new Appointment({
            client: clientId,
            service: serviceId,
            startTime: proposedStartTime,
            endTime: proposedEndTime,
            status: 'confirmed'
        });



        await newAppointment.save({ session });

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'Appointment successfully booked!',
            data: newAppointment,
        });

    } catch (error) {
        await session.abortTransaction();

        console.error('Transactional booking error:', error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Failed to book appointment due to an internal error.'
        });

    } finally {
        session.endSession();
    }
};

// @desc    Get appointments for the logged-in user
// @route   GET /api/appointments/me
// @access  Private
exports.getMyAppointments = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'getMyAppointments controller is working. Logic to be implemented.'
        });
    } catch (error) {
        console.error('Error fetching user appointments:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// @desc    Get all appointments (for admin)
// @route   GET /api/appointments
// @access  Private/Admin
exports.getAllAppointments = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'getAllAppointments controller is working. Logic to be implemented.'
        });
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};