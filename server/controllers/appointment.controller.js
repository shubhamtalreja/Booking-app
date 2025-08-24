const Appointment = require('../models/appointment.model');
const Service = require('../models/service.model');
const Availability = require('../models/availability.model');
const {
    parseISO,
    startOfDay,
    endOfDay,
    setHours,
    setMinutes,
    setSeconds,
    setMilliseconds,
    addMinutes,
    isBefore,
    isAfter,
    getDay,
    format
} = require('date-fns');
const { default: mongoose } = require('mongoose');
const { sendEmail } = require('../utils/email');


// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
    console.log('Received appointment creation request:', req.body);
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { service, date, time } = req.body;
        const clientId = req.user.id; // Reliably get the user ID from the protect middleware

        // --- 1. Basic Input Validation ---
        const serviceId = typeof service === 'string' ? service : service?._id;
        if (!serviceId || !date || !time) {
            return res.status(400).json({ success: false, message: 'serviceId/date/time are required.' });
        }

        const [hours, minutes] = time.split(':').map(Number);
        let proposedStartTime = new Date(date);
        proposedStartTime.setHours(hours, minutes, 0, 0);

        const proposedEndTime = addMinutes(proposedStartTime, service.duration);

        // --- 2. Fetch All Necessary Data in Parallel ---
        const [services, availability, existingAppointments] = await Promise.all([
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

        if (!services) {
            return res.status(404).json({ success: false, message: 'Service not found.' });
        }

        if (!availability) {
            return res.status(400).json({ success: false, message: 'Booking is not possible, as business hours have not been set.' });
        }

        // const proposedEndTime = addMinutes(proposedStartTime, service.duration);

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
            status: 'confirmed',
        });



        await newAppointment.save({ session });

        await session.commitTransaction();

        const populatedAppointment = await Appointment.findById(newAppointment._id).populate('client service');

        try {
            const client = populatedAppointment.client;
            const serviceDetails = populatedAppointment.service;

            const emailOptions = {
                to: client.email,
                subject: `Booking Confirmation: ${serviceDetails.name}`,
                // Plain text version for compatibility
                text: `Hello ${client.name},\n\nYour appointment for ${serviceDetails.name} is confirmed!\n\nDetails:\nDate: ${format(new Date(populatedAppointment.startTime), 'EEEE, MMMM do, yyyy')}\nTime: ${format(new Date(populatedAppointment.startTime), 'p')}\n\nWe look forward to seeing you!\n`,
                // Rich HTML version for modern email clients
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>Booking Confirmation</h2>
                        <p>Hello <strong>${client.name}</strong>,</p>
                        <p>Your appointment for <strong>${serviceDetails.name}</strong> has been successfully booked and confirmed.</p>
                        <hr>
                        <h3>Appointment Details:</h3>
                        <ul>
                        <li><strong>Service:</strong> ${serviceDetails.name}</li>
                        <li><strong>Date:</strong> ${format(new Date(populatedAppointment.startTime), 'EEEE, MMMM do, yyyy')}</li>
                        <li><strong>Time:</strong> ${format(new Date(populatedAppointment.startTime), 'p')}</li>
                        <li><strong>Duration:</strong> ${serviceDetails.duration} minutes</li>
                        </ul>
                        <hr>
                        <p>We look forward to seeing you!</p>
                        <p><em>This is an automated email. Please do not reply.</em></p>
                    </div>
                    `,
                };

            await sendEmail(emailOptions);

        } catch (emailError) {
            // Log the email error for debugging, but don't send an error response to the client.
            // The booking was successful, so that's what matters most.
            console.error('Email could not be sent after successful booking:', emailError);
        }


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
        const appointments = await Appointment.find({ client: req.user.id })
            .populate('service')
            .sort({ startTime: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments,

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
        const appointments = await Appointment.find({})
            .populate('service')
            .populate('client', 'name email')
            .sort({ startTime: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments,

        });
        res.status(200).json({
            success: true,
            message: 'getAllAppointments controller is working. Logic to be implemented.'
        });
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


//  @desc    Delete an appointment
//  @route   DELETE /api/appointments/:id
//  @access  Private
exports.deleteAppointment = async (req, res) => {

    try {
        const appointmentId = req.params.id;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        const CANCELLATION_WINDOW_HOURS = 24;
        const now = new Date();

        const appointmentStartTime = new Date(appointment.startTime);

        if (isBefore(appointmentStartTime, addHours(now, CANCELLATION_WINDOW_HOURS))) {
            return res.status(400).json({
                success: false,
                message: `Appointments cannot be cancelled within ${CANCELLATION_WINDOW_HOURS} hours of the start time.`
            });
        }

        const isOwner = appointment.client.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: 'You do not have permission to delete this appointment.' });
        }

        await appointment.deleteOne();
        res.status(200).json({ success: true, message: 'Appointment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}