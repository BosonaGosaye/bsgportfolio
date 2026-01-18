const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  coverImage: { type: String, required: true },
  gallery: [{ type: String }],
  techStack: [{ type: String }],
  challenges: { type: String },
  solutions: { type: String },
  videoUrl: { type: String },
  githubUrl: { type: String },
  liveUrl: { type: String },
  isFeatured: { type: Boolean, default: false },
  category: { type: String },
  popularity: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
