const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Protected routes (admin only)
router.post('/', protect, serviceController.createService);
router.put('/:id', protect, serviceController.updateService);
router.delete('/:id', protect, serviceController.deleteService);

module.exports = router;
