const asyncHandler = require('express-async-handler');

const Service = require('../models/service.model')


// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {

    const { name, description, duration, price } = req.body;

    if (!name || !description || !duration || !price) {
        throw new Error("Please provide all required fields: name, description, duration, and price.")
    }

    const service = await Service.create({
        name,
        description,
        duration,
        price
    })

    res.status(201).json({ message: `Created new service ${service}` });
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
        res.status(404);
        throw new Error("Service not found");
    }

    res.status(200).json({ serviceById });
})

// @desc    Update an existing service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = asyncHandler(async (req, res) => {

    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error("Service not found");
    }

    const updateService = await Service.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    })
    res.status(200).json({updateService})
})

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
   const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404); // Not Found
    throw new Error('Service not found');
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