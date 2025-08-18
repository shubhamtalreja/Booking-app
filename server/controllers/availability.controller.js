const Availability = require('../models/availability.model');
const Appointment = require('../models/appointment.model');
const Service = require('../models/service.model');
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
  format,
  getDay
} = require('date-fns');

/**
 * @desc    Get available time slots for a given date and service
 * @route   GET /api/availability?date=YYYY-MM-DD&serviceId=...
 * @access  Public
 */
exports.getAvailability = async (req, res) => {
  // We'll define a standard interval for our slots, e.g., every 15 minutes.
  // This provides flexibility, allowing a 45-min service to start at 9:00, 9:15, 9:30 etc.
  const SLOT_INTERVAL = 15; 

  try {
    const { date, serviceId } = req.query;

    // --- 1. Initial Validation ---
    if (!date || !serviceId) {
      return res.status(400).json({ success: false, message: 'Date and service ID are required.' });
    }

    // The date from the query will be a string like '2024-10-27'.
    // We parse it into a JavaScript Date object.
    const targetDate = parseISO(date);

    // --- 2. Fetch All Necessary Data in Parallel ---
    // Using Promise.all is much more efficient than awaiting each database call sequentially.
    const [availability, service, existingAppointments] = await Promise.all([
      Availability.findOne(), // We assume there's only one availability document for the business.
      Service.findById(serviceId),
      Appointment.find({
        // Find appointments that start on the target date.
        // $gte: greater than or equal to the start of the day.
        // $lt: less than the end of the day.
        startTime: {
          $gte: startOfDay(targetDate),
          $lt: endOfDay(targetDate),
        },
        status: 'confirmed', // Only consider confirmed appointments as blocking time.
      }),
    ]);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    if (!availability) {
      // If the admin hasn't set up their schedule, no slots are available.
      return res.status(200).json({ success: true, data: [] });
    }

    const serviceDuration = service.duration; // e.g., 60 (in minutes)

    // --- 3. Determine the Day's Specific Working Hours ---
    const dayOfWeekIndex = getDay(targetDate); // 0 for Sunday, 1 for Monday, etc.
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeekName = days[dayOfWeekIndex];

    const daySchedule = availability.weeklyAvailability.find(
      (day) => day.dayOfWeek === dayOfWeekName
    );

    // Check if the business is closed on this day of the week or if it's a holiday.
    const isNonWorkingDay = availability.nonWorkingDays.some(
        (holiday) => startOfDay(new Date(holiday)).getTime() === startOfDay(targetDate).getTime()
    );

    if (!daySchedule || !daySchedule.isAvailable || isNonWorkingDay) {
      // The business is closed on this day.
      return res.status(200).json({ success: true, data: [] });
    }

    // --- 4. Generate Potential Slots for the Working Day ---
    const availableSlots = [];
    
    // Create Date objects for the start and end of the working day.
    const [startHour, startMinute] = daySchedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = daySchedule.endTime.split(':').map(Number);
    
    let workingDayStart = setMilliseconds(setSeconds(setMinutes(setHours(targetDate, startHour), startMinute), 0), 0);
    let workingDayEnd = setMilliseconds(setSeconds(setMinutes(setHours(targetDate, endHour), endMinute), 0), 0);
    
    let potentialSlotStart = workingDayStart;

    while (isBefore(addMinutes(potentialSlotStart, serviceDuration), addMinutes(workingDayEnd, 1))) {
      const potentialSlotEnd = addMinutes(potentialSlotStart, serviceDuration);

      // --- 5. Check for Conflicts with Existing Appointments ---
      let isSlotAvailable = true;
      for (const appointment of existingAppointments) {
        const existingAppointmentStart = new Date(appointment.startTime);
        const existingAppointmentEnd = new Date(appointment.endTime);

        // Conflict check: A potential slot is unavailable if it overlaps with an existing appointment.
        // Overlap occurs if (StartA < EndB) and (EndA > StartB)
        if (
          isBefore(potentialSlotStart, existingAppointmentEnd) &&
          isBefore(existingAppointmentStart, potentialSlotEnd)
        ) {
          isSlotAvailable = false;
          break; // Found a conflict, no need to check other appointments for this slot.
        }
      }

      if (isSlotAvailable) {
        // If the slot is free, add it to our list in 'HH:mm' format.
        availableSlots.push(format(potentialSlotStart, 'HH:mm'));
      }
      
      // Move to the next potential slot start time based on our interval.
      potentialSlotStart = addMinutes(potentialSlotStart, SLOT_INTERVAL);
    }
    
    // --- 6. Send the Final List of Available Slots ---
    res.status(200).json({
      success: true,
      data: availableSlots,
    });
  } catch (error) {
    console.error('Error in getAvailability:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// The setAvailability function remains unchanged for now.
exports.setAvailability = async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: 'Availability successfully set/updated. Logic to be implemented.',
      data: req.body,
    });
  } catch (error) {
    console.error('Error in setAvailability:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};