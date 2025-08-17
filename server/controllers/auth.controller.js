const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');


const generateJwtToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

//@desc Register a new user
//@route POST /api/auth/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error('User with email already exist')
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
        res.status(400);
        throw new Error('Invalid user data');
    }


})

//@desc Register a new user
//@route POST /api/auth/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
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
        res.status(401);
        throw new Error('Invalid email or password');
    }
})


module.exports = {
    registerUser,
    loginUser
}