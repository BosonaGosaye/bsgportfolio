const Service = require('../models/Service');

// Get all services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: services });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get single service by ID
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.json({ success: true, data: service });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create new service
exports.createService = async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update service
exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.json({ success: true, data: service });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete service
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
