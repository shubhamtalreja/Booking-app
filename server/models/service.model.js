const mongoose = require('mongoose');


const serviceSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true,
        unique: true,
        maxlength: [100, 'Service name cannot be more than 100 characters.']
    },
    description: {
        type: String,
        required: [true, 'Service description is required'],
        trim: true,
        maxlength: [500, 'Service description cannot be more than 500 characters.']
    },
    duration: {
        type: Number,
        required: [true, 'Service duration is required'],
        min: [5, 'Service duration must be at least 5 minutes.'],
        max: [480, 'Service duration cannot exceed 480 minutes (8 hours).']
    },
    price: {
        type: String,
        required: [true, 'Service price is required'],
        min: [0, 'Price cannot be negative.'],
    },
    imageUrls: {
        type: [String],
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
},
    {
        timestamps: true
    })

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service