const Vendor = require('../models/vendor.model')

const asyncHandler = require('../middleware/async.middleware');
const ErrorResponse = require('../utils/errorResponse');


// @desc    Create a new vendor
// @route   POST /api/vendors
const createVendor = asyncHandler(async (req, res) => {
    const { name, description, email, password, address, category, city, phone, imageUrls } = req.body;

    if (!name || !description || !address || !category || !city || !phone || !password || !email) {
        return next(new ErrorResponse(`Please provide all required fields.`, 404))
    }

    const vendorExist = await Vendor.findOne({ email })

    if (vendorExist) {
        return next(new ErrorResponse('Vendor with email already exist', 400));
    }

    const vendor = await Vendor.create({
        name,
        email,
        description,
        address,
        category,
        city,
        phone,
        imageUrls: imageUrls || [],
        password
    })

    res.status(201).json({ vendor });
});

const getAllVendors = asyncHandler(async (req,res) => {

    const allVendors = await Vendor.find({});

    res.status(200).json({ allVendors });
});

module.exports = {
    createVendor,
    getAllVendors
}