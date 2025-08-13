const mongoose = require('mongoose');


const serviceSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Service description is required'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Service duration is required'],
        min: [1, 'Duration must be at least 1 minute.'], // A service must take some amount of time.
    },
    price: {
        type: String,
        required: [true, 'Service price is required'],
        min: [0, 'Price cannot be negative.'], // The price can be 0 (for a free service) but not less.
    }
},
    {
        timestamps: true
    })

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service