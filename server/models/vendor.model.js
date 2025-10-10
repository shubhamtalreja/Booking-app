const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Venodr name is required'],
        trim: true,
        unique: true,
        maxlength: [100, 'Vendor name cannot be more than 100 characters.']
    },
    description: {
        type: String,
        required: [true, 'Vendor description is required'],
        trim: true,
        maxlength: [500, 'Vendor description cannot be more than 500 characters.']
    },
    address: {
        type: Number,
        required: [true, 'Vendor address is required'],
        maxlength: [100, 'Vendor address cannot be more than 100 characters.']
    },
    category:{
        type: String,
        required: true
    },
    imageUrls: {
        type: [String],
    },
},
    {
        timestamps: true
    })

const Vendor = mongoose.model('Vendor',vendorSchema);

module.exports=Vendor;