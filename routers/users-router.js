const express = require('express');
const router = express.Router();
const User = require("../models/userModel");

router.get('/', getUsers, sendUsers);
router.param('userid', findUser);
router.get('/:userid', sendUser);
router.post('/:userid', updateUserPrivacy);

/**
 * Gets all matching users and stores them in req.users.
 * Matching users include:
 *  - Public users
 *  - If name query is given: case insensitive match of public users with that name
 */
function getUsers(req,res, next){
    if(req.query.name){
        User.find({username: { $regex: new RegExp(req.query.name, "i")}}, {privacy: false})
        .exec(function(err, users){
            if(err) return res.status(500).send("Error in the server");
            req.users = users;
            next();
        })
    } else {
        User.find({privacy: false})
        .exec(function(err, users){
            if(err) return res.status(500).send("Error in the server");
            req.users = users;
            next();
        })
    }
}

/**
 * If HTML is requested: Renders the page with list of matching users
 * If JSON is requested: Returns a JSON representation of matching users
 * with that given ID
 */
function sendUsers(req, res){
    res.format({
        'text/html': ()=> {
            res.set('Content-Type', 'text/html');
            res.render('./pages/users', {users: req.users});
        },
        'application/json': ()=> {
            res.set('Content-Type', 'application/json');
            res.json(req.users); 
        },
        'default': ()=> {res.status(406).send('Format not acceptable');}
    });
}

/**
 * Finds the user in the db with the given id and stores that user
 * in req.user
 */
function findUser(req, res, next, id){
    User.findById(id)
    .exec(function(err, user){
        if(err) return res.status(500).send("Error in the server");

        if(!user){
            return res.status(404).send(`User with id ${id} does not exist`);
        }

        req.user = user;
        console.log(req.user);
        next();
    })
}

/**
 * If HTML is requested: 
 *      - Renders the page of the user with the given id
 *      - If the user is private and you are not logged in as the user, an error is displayed
 * If JSON is requested: Returns a JSON representation of the user
 * with that given ID
 */
function sendUser(req, res){
    res.format({
        'application/json': ()=> {
            res.set('Content-Type', 'application/json');
            res.json(req.user); 
        },
        'text/html': ()=> {
            if(req.user.privacy === true && req.user._id != res.locals.session.userid){
                return res.status(403).send(`Unauthorized. This user is private.`);
            }

            res.set('Content-Type', 'text/html');
            res.render('./pages/user', {user: req.user});
        },
        'default': ()=> {res.status(406).send('Format not acceptable');}
    });
}

/**
 * Update the privacy status of the user with the given id
 */
function updateUserPrivacy(req, res){
    User.findOneAndUpdate({_id: req.body.userID}, {privacy: req.body.privacyStatus}, function(err, user){
        if(err) return res.status(500).send('Could not update user');
        res.status(201).json(req.user);
    });
}

module.exports = router;