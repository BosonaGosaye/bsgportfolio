const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  shortBio: { type: String, required: true },
  profileImage: { type: String, required: true },
  aboutImage: { type: String },
  resumeUrl: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
