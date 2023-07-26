
const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModel');
const Message = require('../models/messageModel');


async function CreateMessage(from, to, content) {

    const result = {
        status: "message sent",
        message: ""
    }
    const reciver = await User.findOne({ email: to });

    if (!reciver) {
        console.log(reciver);
        console.log("user not found");
        result.status = "did not send";
        result.message = "user not found";
        return;
    }

    const user = await User.findOne({ email: from });

    const newMessage = new Message({
        messageId: uuidv4(),
        userId: user.userId,
        to,
        content,
    });

    const messageMeta = await newMessage.save();

    result.status = "message sent";
    result.message = "message was delivered";
    result.data = messageMeta;

    return result;
}


async function CreateUser(email, password) {

    const newUser = new User({ userId: uuidv4(), email, password });

    const result = await newUser.save();

    return {
        message: "user saved successfully",
        result
    }
}

async function FindUser(email, validator) {
    let status = {
        message: "valid user",
        value: true,
    };

    const response = await User.findOne({ email });

    const data = response;

    if (data === null || data === undefined) {
        status.value = false;
        status.message = "user not found";
        return status;
    }


    status.data = data;
    status.hash = data.password;

    validator(status.hash);


    return status;

}

async function DeleteUser(email) {
    const response = await User.deleteOne({ email });

    return response;
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

module.exports = { CreateUser, FindUser, UpdateUser, CreateMessage, DeleteUser };