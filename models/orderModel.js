const mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
    restaurantID: {type: Number, required: true},
    restaurantName: {type: String, required: true},
    subtotal: {type: Number, required: true},
    total: {type: Number, required: true},
    fee: {type: Number, required: true},
    tax: {type: Number, required: true},
    order:{}
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
