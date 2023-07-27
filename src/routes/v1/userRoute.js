require('dotenv').config();
const express = require("express");
var expressValidations = require('express-validations');

const userRouter = express.Router();

const saltRounds = process.env.SALT_ROUNDS;


const { CreateMessage, UpdateUser, FindUser, DeleteUser } = require("../../controller/userController");
const { GetMessages, ReportMessage } = require("../../controller/messageController");
const { checkAcess } = require("../../middleware/validation");
const { Secure, Compare } = require("../../helper/password");

const userInfo = {
    email: "",
}

userRouter.patch("/user/update", setUserInfo, checkAcess, async (req, res) => {
    const data = req.body;
    const { firstName, lastName, userName, email, password, picture } = data
    let result = {}

    if (expressValidations.isValidFirstname(firstName)) {
        result = await UpdateUser(email, { firstName });
    }
    if (expressValidations.isValidLastname(lastName)) {
        result = await UpdateUser(email, { lastName });
    }
    if (expressValidations.isStrongPassword(password)) {
        await Secure(saltRounds, password, onError, onSucess);
        function onError(err) {
            res.status(404).json({ err });
        }
        async function onSucess(hash) {
            await UpdateUser(email, { password: hash });
        }
    }
    if (expressValidations.isValidURL(picture)) {
        result = await UpdateUser(email, { picture });
    }
    if (expressValidations.isLength(userName, 6, 20)) {
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

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    let msg = [];
    const response = await GetMessages(userInfo.email);


    if (response.message) {
        console.log(response.message);
        return res.status(200).json({ response });
    }

    const sortBy = req.query.sortBy;

    if (sortBy === "newest") {
        response.personalMessage.filter(message => {
            if (message.sent.getFullYear() === year) {
                if (message.sent.getMonth() === month) {
                    if (message.sent.getDate() === day) {
                        msg.unshift(message);
                    }
                }
            }
            msg.push(message);
        });
    } else if (sortBy === "oldest") {
        response.personalMessage.map(message => {
            if (message.sent.getFullYear() < year) {
                if (message.sent.getMonth() < month) {
                    if (message.sent.getDate() <= day) {
                        msg.unshift(message);
                    }
                }
            }
            msg.push(message);
        })
    }

    res.status(200).json({ msg });
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

userRouter.delete("/user/delete", checkAcess, async (req, res) => {
    const { email, password } = req.body;

    await FindUser(email, validator).then((result) => {
        if (!result.value) {
            res.status(400).json({ message: result.message });
        }
    });

    async function validator(hash) {
        if (hash === undefined) {
            return res.status(400).json({ message: "user not found" });
        }


        Compare(password, hash, onError, onSucess);

        function onError(err) {
            res.status(400).json({ message: err });
        }

        async function onSucess(result) {
            res.clearCookie("userInfo");
            if (result) {
                const response = await DeleteUser(email);
                console.log(response);
                res.status(200).json({ message: `user deleted successfuly` });
            } else {
                res.status(400).json({ message: "incorrect password" });

            }
        }
    }
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