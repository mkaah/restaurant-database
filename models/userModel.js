const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    privacy: {type: Boolean, required: true},
    orders: [] 
});

const User = mongoose.model("User", userSchema);
module.exports = User;
