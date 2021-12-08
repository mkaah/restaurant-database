const express = require('express');
const router = express.Router();
const Order = require("../models/orderModel");
const User = require("../models/userModel");

router.post('/', createOrder);
router.param('orderid', findOrder);
router.get('/:orderid', sendOrder);

/**
 * Creates an Order object with the data from req.body + userid of the current user,
 * pushes the order to the user's list of orders, and saves the order to the db
 */
function createOrder(req,res,next){
    let order = new Order();
    order.user = req.session.userid;
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
        res.status(200).json(req.user);
    });

    // save order to db
    order.save(function(err, result) {
        if(err) return res.status(500).send('Could not create new order');
        next();
    });
    
}

/**
 * Finds the order in the db with the given id and populates its
 * user property with the user who placed the order
 */
function findOrder(req, res, next, id){
    Order.findById(id)
    .populate('user')
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

/**
 * If HTML is requested: 
 *      - Renders the page of the order with the given id
 *      - If the owner of that order is private and you are not logged in as the owner,
 *        an error is displayed
 * If JSON is requested: Returns a JSON representation of the order
 * with that given ID
 */
function sendOrder(req, res){
    res.format({
        'application/json': ()=> {
            res.set('Content-Type', 'application/json');
            res.json(req.order); 
        },
        'text/html': ()=> {
            // owner is private and user is not logged in as the owner, display error
            if(req.order.user.privacy === true && req.order.user._id != res.locals.session.userid){
                return res.status(403).send(`Unauthorized. This user is private.`);
            }

            res.set('Content-Type', 'text/html');
            res.render('./pages/order', {order: req.order});
        },
        'default': ()=> {res.status(406).send('Format not acceptable');}
    });
}

module.exports = router;