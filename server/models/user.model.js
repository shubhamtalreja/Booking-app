const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true
    },
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
    password: {
        type: String,
        require: [true, "Password is required"]
    },
    role: {
        type: String,
        required: true,
        enum: {
            values: ['client', 'admin'],
            message: '{VALUE} is not a supported role. Role must be either "client" or "admin".'
        },
        default: 'client'
    }
}, {
    timestamps: true
}
)

const User = mongoose.model('User', userSchema);

module.exports = User;