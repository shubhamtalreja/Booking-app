const mongoose = require('mongoose');

const dailyAvailabilitySchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    required: [true, 'Day of the week is required.'],
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  startTime: {
    type: String, 
    required: function() { return this.isAvailable; },
  },
  endTime: {
    type: String,
    required: function() { return this.isAvailable; },
  },
});

const AvailabilitySchema = new mongoose.Schema({

  weeklyAvailability: [dailyAvailabilitySchema],

  nonWorkingDays: {
    type: [Date],
    default: [],
  },
}, { 
  timestamps: true 
});

const Availability = mongoose.model('Availability', AvailabilitySchema);

module.exports = Availability;