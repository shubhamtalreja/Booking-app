const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ErrorResponse = require('../utils/errorResponse');


const generateJwtToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

//@desc Register a new user
//@route POST /api/auth/register
//@access Public
const registerUser = asyncHandler(async (req, res, next) => {

    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
        return next(new ErrorResponse('User with email already exist', 400));
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateJwtToken(user._id),

        })
    } else {
        return next(new ErrorResponse('Invalid user data', 400));
    }


})

//@desc Register a new user
//@route POST /api/auth/login
//@access Public
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateJwtToken(user._id),
        });
    } else {
        return next(new ErrorResponse('Invalid email or password', 401));
    }
})


module.exports = {
    registerUser,
    loginUser,
}