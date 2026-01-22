const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // For PDFs, use image resource type (Cloudinary handles PDFs better this way for public access)
    const isPdf = file.mimetype === 'application/pdf';

    if (isPdf) {
      return {
        folder: 'bsgportfolio',
        resource_type: 'image', // Use 'image' instead of 'raw' to avoid 401 errors
        format: 'pdf',
        public_id: `resume_${Date.now()}`,
        flags: 'attachment', // Force download
      };
    } else {
      // For images
      return {
        folder: 'bsgportfolio',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      };
    }
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
