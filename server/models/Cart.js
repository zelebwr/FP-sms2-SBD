const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
    priceAtAddition: {
        type: Number
    }
}, {_id: false});

const cartSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    items: [cartItemSchema]
}, {
    timestamps: true // This will manage createdAt and updatedAt automatically
});

module.exports = mongoose.model('Cart', cartSchema);
