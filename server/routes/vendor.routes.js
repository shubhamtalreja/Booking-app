const express = require('express');
const router = express.Router();
const {
    createVendor,
    getAllVendors,
} = require('../controllers/vendor.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');

router.post('/register',protect, admin, createVendor);
router.get('/',getAllVendors);
    

module.exports = router