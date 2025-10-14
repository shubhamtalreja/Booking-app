const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Venodr name is required'],
        trim: true,
        unique: true,
        maxlength: [100, 'Vendor name cannot be more than 100 characters.']
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
    description: {
        type: String,
        required: [true, 'Vendor description is required'],
        trim: true,
        maxlength: [500, 'Vendor description cannot be more than 500 characters.']
    },
    address: {
        type: String,
        required: [true, 'Vendor address is required'],
        maxlength: [100, 'Vendor address cannot be more than 100 characters.']
    },
    category: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: [true, 'Vendor phone number is required'],
    },
    imageUrls: {
        type: [String],
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        default: 'admin'
    }
},
    {
        timestamps: true
    })

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;