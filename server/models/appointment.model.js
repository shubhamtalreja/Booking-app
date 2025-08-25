
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client ID is required for an appointment.'],
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service ID is required for an appointment.'],
    },

    startTime: {
      type: Date,
      required: [true, 'Appointment start time is required.'],
    },
    endTime: {
      type: Date,
      required: [true, 'Appointment end time is required.'],
    },

    status: {
      type: String,
      enum: ['pending_payment', 'confirmed', 'cancelled'],
      default: 'pending_payment',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ startTime: 1 });

appointmentSchema.index({ client: 1, startTime: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;