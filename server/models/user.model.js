const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        required: [true, "Password is required"]
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
});

userSchema.pre('save', async function(next){

    if(!this.isModified('password') ){
        return next();
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password,salt);

    next();
 });

 userSchema.methods.matchPassword = async function(enteredPassword){

    return await bcrypt.compare(enteredPassword, this.password);
 }

const User = mongoose.model('User', userSchema);

module.exports = User;