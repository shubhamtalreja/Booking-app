const express = require('express');
const { generateOtp, validateOtp } = require('../controllers/otp.controller');
const router = express.Router();


router.post('/send', generateOtp);

router.post('/validate', validateOtp);


module.exports = router;
