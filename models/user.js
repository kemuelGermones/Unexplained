const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// User Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Passport local mongoose adds username, hashed password & methods

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);