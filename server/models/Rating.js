const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    productId: { type: Number, required: true, index: true },
    userId: { type: Number, required: true },
    ratingValue: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String },
    imageUrl: { type: String },
    videoUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);