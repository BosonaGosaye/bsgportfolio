const Experience = require('../models/Experience');

// @desc    Get all experience records
// @route   GET /api/experience
// @access  Public
const getExperience = async (req, res) => {
  try {
    const experience = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create experience record
// @route   POST /api/experience
// @access  Private/Admin
const createExperience = async (req, res) => {
  try {
    const experience = new Experience(req.body);
    const createdExperience = await experience.save();
    res.status(201).json(createdExperience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getExperience, createExperience };
