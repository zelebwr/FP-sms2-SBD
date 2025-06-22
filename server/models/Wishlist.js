const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
}, {_id: false});

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    items: [wishlistItemSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Wishlist', wishlistSchema);