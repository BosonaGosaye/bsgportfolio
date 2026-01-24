const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true,
        default: 'Briefcase'
    },
    features: [{
        type: String
    }],
    price: {
        type: String,
        trim: true
    },
    duration: {
        type: String,
        trim: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient sorting
serviceSchema.index({ order: 1 });

module.exports = mongoose.model('Service', serviceSchema);
