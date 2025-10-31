const express = require('express');
const router = express.Router();
const {
    createVendor,
    getAllVendors,
} = require('../controllers/vendor.controller');

router.post('/register', createVendor);
router.get('/',getAllVendors);
    

module.exports = router