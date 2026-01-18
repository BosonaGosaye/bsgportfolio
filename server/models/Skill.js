const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Frontend', 'Backend', 'Tools', 'Design', 'Other'] },
  percentage: { type: Number, min: 0, max: 100 },
  icon: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
