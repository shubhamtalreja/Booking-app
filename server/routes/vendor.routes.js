const express = require('express');
const router = express.Router();
const {
    createVendor,
} = require('../controllers/vendor.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.route('/')
    .post(protect, admin, createVendor);
3

module.exports = router