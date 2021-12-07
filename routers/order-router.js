const express = require('express');
const router = express.Router();
const Order = require("../models/orderModel");

// - GET '/orders', 
// - POST '/orders'
// - GET '/orders/:orderid'

// router.get('/', );
router.post('/', createOrder);
// router.param('orderid', findOrder);
// router.get('/:orderid', getTargetOrder);

function createOrder(req,res,next){
    let order = new Order();
    // order.user = req.user._id;
    order.restaurantID = req.body.restaurantID;
    order.restaurantName = req.body.restaurantName;
    order.subtotal = req.body.subtotal;
    order.total = req.body.total;
    order.fee = req.body.fee;
    order.tax = req.body.tax;
    order.order = req.body.order;

    // order.save(function(err, result){
    //     if(err) return res.status(500).send("Unable to create new order")
    // })

}

module.exports = router;