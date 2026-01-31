const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Frontend', 'Backend', 'Mobile Application', 'Tools & Technologies', 'Database & Cloud', 'DevOps & Deployment', 'Testing & Debugging', 'Design', 'Soft Skills', 'Other'] },
  percentage: { type: Number, min: 0, max: 100 },
  icon: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
