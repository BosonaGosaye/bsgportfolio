const express = require('express');
const router = express.Router();
const { getExperience, createExperience } = require('../controllers/experienceController');

router.get('/', getExperience);
router.post('/', createExperience); // Admin auth to be added later

module.exports = router;
