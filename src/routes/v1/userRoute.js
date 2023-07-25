
const express = require("express");
const bcrypt = require('bcrypt');

const userRouter = express.Router();

const saltRounds = 10;


const { CreateMessage, UpdateUser, FindUser } = require("../../controller/userController");
const { GetMessages, ReportMessage } = require("../../controller/messageController");
const { checkAcess } = require("../../middleware/validation");

const userInfo = {
    email: "",
}

userRouter.patch("/user/update", setUserInfo, checkAcess, async (req, res) => {
    const data = req.body;
    const { firstName, lastName, userName, email, password, picture } = data
    let result = {}

    if (firstName !== "" && firstName !== undefined) {
        console.log(firstName);
        result = await UpdateUser(email, { firstName });
    }
    if (lastName !== undefined && lastName !== null) {
        console.log(lastName);
        result = await UpdateUser(email, { lastName });
    }
    if (password !== "" && password !== undefined) {
        console.log(password);
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            console.log(hash);
            await UpdateUser(email, { password: hash });
        });
    }
    if (picture !== "" && picture !== undefined) {
        console.log(picture);
        result = await UpdateUser(email, { picture });
    }
    if (userName !== "" && userName !== undefined) {
        console.log(userName);
        result = await UpdateUser(email, { userName });
    }

    res.status(200).json({ message: "profile updated", user: result.data, error: result.error });
});

userRouter.post("/user/message", setUserInfo, checkAcess, async (req, res) => {

    const { message, to } = req.body;

    if (to == "" || to == undefined) {
        res.status(400).json({
            message: "a reciver must be added",
        });
        return;
    }

    if (message == "" || message == undefined) {
        res.status(400).json({
            message: "the message must contain a value",
        });
        return;
    }
    const response = await CreateMessage(userInfo.email, to, message);

    res.status(200).json({ response })
});

userRouter.get("/user/inbox", setUserInfo, checkAcess, async (req, res) => {
    const response = await GetMessages(userInfo.email);

    if (response.message) {
        res.status(200).json({ response: response.message });
    } else {
        res.status(200).json(response);
    }
});

userRouter.post("/user/report", setUserInfo, checkAcess, async (req, res) => {
    const id = req.body.id;

    const response = await ReportMessage(id);

    res.status(200).json({ response });
});

userRouter.post("/user/logout", setUserInfo, checkAcess, async (req, res) => {
    res.clearCookie("userInfo");
    res.status(200).json({ message: "logged out succesfully" });
    userInfo.email = "";
})


function setUserInfo(req, res, next) {
    if (req.cookies == undefined) {
        return next();
    } else {
        userInfo.email = req.cookies?.userInfo?.email;
        return next();
    }
    next();
}

module.exports = {
    userRouter
}