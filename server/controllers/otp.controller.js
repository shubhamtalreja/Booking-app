const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const emailOtp = require('../models/otp.model');
const sendEmail = require('../utils/email');


const generateOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
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
        res.status(401).json({ message: "Unknown error" });
    }
})

module.exports = {
    generateOtp
}