const express = require('express');
const router = express.Router();
const Order = require("../models/orderModel");
const User = require("../models/userModel");

// - GET '/orders', 
// - POST '/orders'
// - GET '/orders/:orderid'

// router.get('/', );
router.post('/', getUser, createOrder);
router.param('orderid', findOrder, findOrderOwner);
router.get('/:orderid', sendOrder);

function createOrder(req,res,next){
    let order = new Order();
    // order.user = req.user;
    order.user = req.user._id;
    order.restaurantID = req.body.restaurantID;
    order.restaurantName = req.body.restaurantName;
    order.subtotal = req.body.subtotal;
    order.total = req.body.total;
    order.fee = req.body.fee;
    order.tax = req.body.tax;
    order.order = req.body.order;

    // push order to user
    User.updateOne({username: req.session.username}, {$push: {orders: order}}, function(err, result){
        if(err) return res.status(500).send("Could not update user's order");
        res.status(201).json(req.user);
    });

    order.save(function(err, result) {
        if(err) return res.status(500).send('Could not create new order');
        next();
    });
    
}

function findOrder(req, res, next, id){
    Order.findById(id)
    .exec(function(err, order){
        if(err) return res.status(500).send("Error in the server");

        if(!order){
            return res.status(404).send(`Order with id ${id} does not exist`);
        }
        
        req.order = order;
        console.log(req.order);
        next();
    })
}

function findOrderOwner(req, res, next){
    User.findById(req.order.user)
    .exec(function(err, order){
        if(err) return res.status(500).send("Error in the server");

        if(!order){
            return res.status(404).send(`User with id ${req.order.user} does not exist`);
        }
        
        req.orderOwner = order;
        next();
    })
}

function sendOrder(req, res){
    res.format({
        'application/json': ()=> {
            res.set('Content-Type', 'application/json');
            res.json(req.order); 
        },
        'text/html': ()=> {
            // if(req.order.user.privacy === true && req.user._id != res.locals.session.userid){
            //     return res.status(403).send(`Unauthorized. This user is private.`);
            // }

            // console.log(req.order);

            res.set('Content-Type', 'text/html');
            res.render('./pages/order', {order: req.order, user: req.orderOwner});
        },
        'default': ()=> {res.status(406).send('Format not acceptable');}
    });
}

// get current user to add onto order object
function getUser(req, res, next){
    User.find({username: req.session.username})
    .exec(function(err, user){
        if(err) return res.status(500).send("Error in the server");

        if(!user){
            return res.status(404).send(`User with username ${username} does not exist`);
        }

        req.user = user;
        console.log(req.user);
        next();
    })
}

module.exports = router;