const mongoose = require('mongoose');


const emailOtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "User email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
})

const emailOtp = mongoose.model('emailOtp', emailOtpSchema);

module.exports = emailOtp