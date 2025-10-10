const express = require('express');
const router = express.Router();
const {
    createVendor,
    getAllVendors,
} = require('../controllers/vendor.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.route('/')
    .get(getAllVendors)
    .post(protect, admin, createVendor);

module.exports = router