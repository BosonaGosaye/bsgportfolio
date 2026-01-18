const express = require('express');
const router = express.Router();
const { getEducation, createEducation } = require('../controllers/educationController');

router.get('/', getEducation);
router.post('/', createEducation); // Admin auth to be added later

module.exports = router;
