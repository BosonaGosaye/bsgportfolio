const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  featuredImage: { type: String, required: true },
  images: [{ type: String }],
  videoUrl: { type: String },
  publishDate: { type: Date, default: Date.now },
  readTime: { type: String },
  isPublished: { type: Boolean, default: true },
  tags: [{ type: String }],
  views: { type: Number, default: 0 }
}, { timestamps: true });

blogSchema.index({ isPublished: 1, createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);

