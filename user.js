const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: String,
    firstName: String,
    lastName: String,
    picture: String,
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


async function CreateUser(email, password) {

    const newUser = new User({ email, password });

    await newUser.save().then(() => {
        console.log("user saved successfully");
    }).catch((error) => {
        console.log(error);
    });
}


async function FindUser(email, password) {

    let status = {
        message: "valid user",
        value: true,
    };

    const response = await User.findOne({ email });

    const data = response;

    console.log(data);

    if (data === null || data === undefined) {
        status.value = false;
        status.message = "user not found";
        return status;
    }
    if (password == null || password == undefined || password != data?.password) {
        status.value = false;
        status.message = "password is incorrect";
        return status;
    }

    return status;
}

async function UpdateUser(email, request) {

    let status = {};

    await User.findOneAndUpdate({ email }, request).then((data) => {
        status.data = data;
        status.message = "profile updated";
    }).catch((err) => {
        status.error = err;
        status.message = "failed";
    });

    return status;
}

module.exports = { User, CreateUser, FindUser, UpdateUser };