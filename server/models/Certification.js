const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: Date, required: true },
  url: { type: String },
  certificateFile: { type: String }, // URL to uploaded certificate image/PDF
  certificateFileType: { type: String, enum: ['image', 'pdf'], default: 'image' }, // Type of file
  status: { type: String, enum: ['Active', 'Expired', 'In Progress'], default: 'Active' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
