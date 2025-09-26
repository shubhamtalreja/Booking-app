const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const emailOtp = require('../models/otp.model');
const sendEmail = require('../utils/email');
const User = require('../models/user.model');
const ErrorResponse = require('../utils/errorResponse');


const generateOtp = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
        return next(new ErrorResponse('User with email already exist', 400))
    }

    const otp = crypto.randomInt(100000, 1000000);
    const emailOptions = {
        to: email,
        subject: `TapApt Email Verification`,
        text: `Your 6 digit Otp is ${otp}, Valid for only 10 minutes`,
    };
    await sendEmail(emailOptions);
    const optSave = await emailOtp.create({
        email,
        otp,
    })
    if (optSave) {
        res.status(201).json({ message: "Otp send to email" });

    } else {
        return next(new ErrorResponse('Otp not sent', 400))
    }
});

const validateOtp = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;
    const getOtp = await emailOtp.findOne({ email, otp });
    if (getOtp) {
        res.status(200).json({ message: "Email verified" });
    } else {
        return next(new ErrorResponse('Wrong otp', 400));
    }
});

module.exports = {
    generateOtp,
    validateOtp
}