const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('file'), (req, res) => {
  if (req.file) {
    let fileUrl = req.file.path;

    // For PDFs, generate a signed URL to avoid 401 errors
    if (req.file.mimetype === 'application/pdf') {
      const { cloudinary } = require('../utils/cloudinary');

      // Generate signed URL that doesn't expire (or expires in 100 years)
      fileUrl = cloudinary.url(req.file.filename, {
        resource_type: 'image',
        type: 'upload',
        sign_url: true,
        secure: true,
      });
    }

    res.json({
      url: fileUrl,
      public_id: req.file.filename
    });
  } else {
    res.status(400).json({ message: 'File upload failed' });
  }
});

module.exports = router;
