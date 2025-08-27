const Service = require('../models/service.model')

const asyncHandler = require('../middleware/async.middleware');
const ErrorResponse = require('../utils/errorResponse');
// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {

    const { name, description, duration, price } = req.body;

    if (!name || !description || !duration || !price) {
        return next(new ErrorResponse(`Please provide all required fields: name, description, duration, and price.`, 404))

    }

    const service = await Service.create({
        name,
        description,
        duration,
        price
    })

    res.status(201).json({ service });
})

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getAllServices = asyncHandler(async (req, res) => {

    const allServices = await Service.find({});

    res.status(200).json({ allServices });
})

// @desc    Get a single service by its ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = asyncHandler(async (req, res) => {

    const serviceById = await Service.findById(req.params.id);

    if (!serviceById) {
        return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({ serviceById });
})

// @desc    Update an existing service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = asyncHandler(async (req, res) => {

    const service = await Service.findById(req.params.id);

    if (!service) {
        return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404))
    }

    const updateService = await Service.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({ updateService })
})

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404))

    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Service deleted successfully', id: req.params.id });
})

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
}