const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer/Cloudinary Error:', err);
      return res.status(500).json({ 
        message: 'Upload failed', 
        error: err.message 
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let fileUrl = req.file.path;

    // For PDFs, generate a signed URL to avoid 401 errors
    if (req.file.mimetype === 'application/pdf') {
      try {
        const { cloudinary } = require('../utils/cloudinary');

        // Generate signed URL that doesn't expire (or expires in 100 years)
        fileUrl = cloudinary.url(req.file.filename, {
          resource_type: 'image',
          type: 'upload',
          sign_url: true,
          secure: true,
        });
      } catch (cloudErr) {
        console.error('Cloudinary signing error:', cloudErr);
      }
    }

    res.json({
      url: fileUrl,
      public_id: req.file.filename || req.file.public_id
    });
  });
});

module.exports = router;
