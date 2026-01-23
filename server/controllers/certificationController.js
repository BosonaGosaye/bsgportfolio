const Certification = require('../models/Certification');

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
const getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ order: 1, createdAt: -1 });
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create certification
// @route   POST /api/certifications
// @access  Private/Admin
const createCertification = async (req, res) => {
  try {
    const certification = new Certification(req.body);
    const createdCertification = await certification.save();
    res.status(201).json(createdCertification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update certification
// @route   PUT /api/certifications/:id
// @access  Private/Admin
const updateCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    Object.assign(certification, req.body);
    const updatedCertification = await certification.save();
    res.json(updatedCertification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete certification
// @route   DELETE /api/certifications/:id
// @access  Private/Admin
const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    await certification.deleteOne();
    res.json({ message: 'Certification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCertifications, createCertification, updateCertification, deleteCertification };
