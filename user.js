const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: String,
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const User = mongoose.model("user", userSchema);

export default User;