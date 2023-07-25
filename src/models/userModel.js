const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: String,
    firstName: String,
    lastName: String,
    picture: String,
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});


const User = mongoose.model("user", userSchema);

module.exports = User;