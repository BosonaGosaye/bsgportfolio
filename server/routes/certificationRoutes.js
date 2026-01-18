const express = require('express');
const router = express.Router();
const { getCertifications, createCertification } = require('../controllers/certificationController');

router.get('/', getCertifications);
router.post('/', createCertification); // Admin auth to be added later

module.exports = router;
