const Education = require('../models/Education');

// @desc    Get all education records
// @route   GET /api/education
// @access  Public
const getEducation = async (req, res) => {
  try {
    const education = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create education record
// @route   POST /api/education
// @access  Private/Admin
const createEducation = async (req, res) => {
  try {
    const education = new Education(req.body);
    const createdEducation = await education.save();
    res.status(201).json(createdEducation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update education record
// @route   PUT /api/education/:id
// @access  Private/Admin
const updateEducation = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education) {
      return res.status(404).json({ message: 'Education record not found' });
    }

    Object.assign(education, req.body);
    const updatedEducation = await education.save();
    res.json(updatedEducation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete education record
// @route   DELETE /api/education/:id
// @access  Private/Admin
const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education) {
      return res.status(404).json({ message: 'Education record not found' });
    }

    await education.deleteOne();
    res.json({ message: 'Education record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEducation, createEducation, updateEducation, deleteEducation };
