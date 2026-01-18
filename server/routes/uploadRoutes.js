const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({
      url: req.file.path,
      public_id: req.file.filename
    });
  } else {
    res.status(400).json({ message: 'File upload failed' });
  }
});

module.exports = router;
