const express = require('express');
const router = express.Router();
const User = require("../models/userModel");


router.get('/', getUsers, sendUsers);
router.param('userid', findUser);
router.get('/:userid', sendUser);
router.post('/:userid', updateUserPrivacy);


// get all public users
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

function findUser(req, res, next, id){
    // Search db for user with given id
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

function updateUserPrivacy(req, res){
    User.findOneAndUpdate({_id: req.body.userID}, {privacy: req.body.privacyStatus}, function(err, user){
        if(err) return res.status(500).send('Could not update user');
        res.status(201).json(req.user);
    });
}



module.exports = router;