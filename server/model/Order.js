const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: {
            type: Number,
            default: 1
        }
    }],
    name: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    email: {
        type: String
    },
    prescription: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Preparing", "On The Way", "Delivered", "Cancelled"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("MedicineOrder", orderSchema)