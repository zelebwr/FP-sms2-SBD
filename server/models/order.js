const mongoose = require('mongoose');

// define the order schema
const OrderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }, 
            quantity: {
                type: Number,
                required: true,
                min: 1, 
                default: 1
            }
        }
    ], 
    customerName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;