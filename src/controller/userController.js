
const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModel');
const Message = require('../models/messageModel');


async function CreateMessage(from, to, content) {

    const status = {
        messageStatus: "message sent",
        messageContent: ""
    }
    const reciver = await User.findOne({ email: to });

    if (!reciver) {
        console.log(reciver);
        console.log("user not found");
        status.messageStatus = "did not send";
        status.messageContent = "user not found";
        return;
    }

    const user = await User.findOne({ email: from });

    const newMessage = new Message({
        messageId: uuidv4(),
        userId: user.userId,
        to,
        content,
    });

    newMessage.save();

    status.messageStatus = "message sent";
    status.messageContent = "message was delivered";

    return status;
}


async function CreateUser(email, password) {

    const newUser = new User({ userId: uuidv4(), email, password });

    await newUser.save().then(() => {
        console.log("user saved successfully");
    }).catch((error) => {
        console.log(error);
    });
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

    validator(data.password);

    status.data = data;

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

module.exports = { CreateUser, FindUser, UpdateUser, CreateMessage };