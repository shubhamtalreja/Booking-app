const express = require('express');
const router = express.Router();
const {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} = require('../controllers/service.controller');
const { protect } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');
const upload = require('../middleware/multer.middleware')

router.route('/')
    .get(getAllServices)
    .post(protect, admin,upload.single("image"), createService);

router.route('/:id')
    .get(getServiceById)
    .put(protect, admin, updateService)
    .delete(protect, admin, deleteService);

module.exports = router