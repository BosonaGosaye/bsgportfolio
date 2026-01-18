const Profile = require('../models/Profile');

// @desc    Get profile
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private/Admin
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (profile) {
      Object.assign(profile, req.body);
      const updatedProfile = await profile.save();
      res.json(updatedProfile);
    } else {
      const newProfile = new Profile(req.body);
      const createdProfile = await newProfile.save();
      res.status(201).json(createdProfile);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
