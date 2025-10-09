const Vendor = require('../models/vendor.model')

const asyncHandler = require('../middleware/async.middleware');
const ErrorResponse = require('../utils/errorResponse');


// @desc    Create a new vendor
// @route   POST /api/vendors
// @access  Private/Admin
const createVendor = asyncHandler(async (req, res) => {
    const { name, description, address, category, imageUrls } = req.body;

    if (!name || !description || !address || !category) {
        return next(new ErrorResponse(`Please provide all required fields: name, description, address, and category.`, 404))

    }

    const vendor = new Vendor.create({
        name,
        description,
        address,
        category,
        imageUrls: imageUrls || []
    })

    res.status(201).json({ vendor });
});

module.exports={
    createVendor
}