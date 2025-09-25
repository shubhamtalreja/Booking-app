const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    generateOtp
} = require('../controllers/auth.controller');


router.post('/register', registerUser);

router.post('/login', loginUser);

module.exports = router;