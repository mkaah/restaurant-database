const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    privacy: {type: Boolean, required: true},
    order: {} // create schema for food item?
});

const User = mongoose.model("User", userSchema);
module.exports = User;
