const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo');

const app = express();
const PORT = process.env.PORT || 3000;
const User = require("./models/userModel");

// Routers
const orderRouter = require('./routers/order-router');
const usersRouter = require('./routers/users-router');

// Global variables
// app.locals.restaurants = {};

// Setting session store
const store = new MongoDBStore({
    mongoUrl: 'mongodb://localhost:27017/a4',
    collection: 'sessions'
});
store.on('error', (error) => {console.log(error)});

// Middleware
app.set('views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    name: 'a4-session',
    secret: 'some very secret key',
    store: store,
    resave: true,
    saveUninitialized: false
}));

// log out request information
app.use((req, res, next) => {
    console.log(`${req.method}: ${req.url}`);
    if(Object.keys(req.body).length > 0){
        console.log('Body:');
        console.log(req.body);
    }
    next();
});

/************** Server Routes **************/
app.use(exposeSession);
app.get(['/', '/home'], (req,res) => res.render('./pages/home'));
app.get('/login', (req,res) => res.render('./pages/login'));
app.get('/register', (req,res) => res.render('./pages/register'));
app.post('/register', register);
app.post('/login', login);
app.get('/logout', logout);

app.use('/users', usersRouter);
app.use('/orders', auth, orderRouter);

// Expose session to pug
function exposeSession(req,res,next){
    if(req.session){
        res.locals.session = req.session;
    }
    next();
}

function register(req, res, next){
    // Check if user already exists
    User.find({username: req.body.username}, function(err, result){
        if(err) return res.status(401).send("Error finding user");

        if(result.length === 0){ // user does not exist - add them to the db
            let newUser = new User({username: req.body.username, password: req.body.password, privacy: false});
            newUser.save(function(err, result) {
                if(err) return console.log(err.message);
                //res.status(200).send(JSON.stringify(newUser));
            });
            
            // log user in 
            req.session.loggedin = true;
            req.session.username = newUser.username;
            req.session.userid = newUser._id;
            res.locals.session = req.session;
            res.status(200).send(JSON.stringify(req.session.userid));
            return;
        } else{ // user already exists
            res.status(401).send("User already exists"); // sends 3 times??
            return;
        }
    })
}

function login(req, res, next){
    if(req.session){
        if(req.session.loggedin){
            res.status(200).send(JSON.stringify(req.session.userid));
            return;
        }
        
        User.findOne({username: req.body.username, password: req.body.password}, function(err, result){
            if(err) return res.status(401).send("Error finding user");
            
            if(!result){ // user not found
                res.status(401).send("Could not find user");
                return;
            } else{
                console.log(result);
    
                req.session.loggedin = true;
                req.session.username = result.username;
                req.session.userid = result._id;
                res.locals.session = req.session;
                res.status(200).send(JSON.stringify(req.session.userid));
                return;
            }
        });
    } else{
        res.status(401).send("Session does not exist");
    }
}

function logout(req, res){
    req.session.destroy();
    delete res.locals.session;
    res.redirect('/home');
}

function auth(req, res, next){
    if(!req.session.loggedin){
        res.status(401).send("Must login first");
    } else {
        next();
    }
}

// Connecting to the database
mongoose.connect('mongodb://localhost:27017/a4', {useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to database'));
db.once('open', function() {
    User.init( () => {
        // initialize data and start server
        app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));
    })
});
