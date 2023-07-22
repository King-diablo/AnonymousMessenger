const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    userName: String,
    firstName: String,
    lastName: String,
    picture: String,
    messages: [{
        customId: String,
        from: String,
        to: String,
        content: String,
        sent: Date,
        reportCount: Number
    }],
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

    console.log(reciver);

    const message = {
        customId: uuidv4(),
        from,
        to,
        content,
        sent: new Date(),
        reportCount: 0
    }

    const user = await User.findOne({ email: from });

    user.messages.push(message);

    user.save();

    status.messageStatus = "message sent";
    status.messageContent = "message was delivered";

    return status;
}


async function GetMessages(email) {

    const response = await User.find({});

    const responseData = response.map(data => {
        const inboxMessages = data.messages.map(messages => {
            if (messages.to === email) {
                return {
                    to: messages.to,
                    content: messages.content,
                    sent: messages.sent,
                    reportCount: messages.reportCount
                };
            } else {
                return;
            }
        });

        const newResponse = inboxMessages.filter(msg => {
            if (msg) {
                return msg;
            }
        })
        return newResponse;
    })

    // const messages = responseData.map(data => {
    //     const inboxMessages = data.messages.map(messages => {
    //         if (messages.to === email) {
    //             return {
    //                 to: messages.to,
    //                 content: messages.content,
    //                 sent: messages.sent,
    //                 reportCount: messages.reportCount
    //             };
    //         }
    //     });
    //     return inboxMessages;
    // });



    return responseData;
}

async function ReportMessage(id) {

    const message = await User.findOneAndUpdate(
        {
            'messages.customId': id,
            'messages.customId': id,
        },
        {
            $setOnInsert: {
                'messages.$.reportCount': 1
            },
        },
        {
            new: true, projection: {
                _id: 0,
                'messages.to': 1,
                'messages.content': 1,
                'messages.sent': 1,
                'messages.reportCount': 1
            }
        }
    );

    return message;
}


async function CreateUser(email, password) {

    const newUser = new User({ email, password });

    await newUser.save().then(() => {
        console.log("user saved successfully");
    }).catch((error) => {
        console.log(error);
    });
}

async function FindUser(email, password, validator) {

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

module.exports = { User, CreateUser, FindUser, UpdateUser, CreateMessage, GetMessages, ReportMessage };