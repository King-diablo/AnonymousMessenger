const port = 3000;

let isLoggedIn = false;


const express = require("express");

const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const client = require("./connection");
const { User, CreateUser, FindUser, UpdateUser, CreateMessage, GetMessages, ReportMessage } = require("./user");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const userInfo = {
    email: "",
}

client.RunUserDB();

app.post("/api/register", validateDetail, async (req, res) => {
    const data = req.body;

    const { email, password } = data;

    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
            logger(err);
            res.status(400).json({ message: err })
        }
        logger(salt);
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                logger(err);
                res.status(400).json({ message: err })
            }
            logger(hash);
            CreateUser(email, hash);

            res.status(201).json({ message: "user created successfully" });

            isLoggedIn = true;
        })
    });
});

app.post("/api/login", validateDetail, async (req, res) => {

    if (res.message) {
        const { message } = res;
        logger(message);
        res.status(400).json({ message });
    }

    const data = req.body;

    const { email, password } = data;

    await FindUser(email, password, validator).then((result) => {
        if (result.value !== true) {
            res.status(400).json({ message: result.message });
        }
    });

    function validator(hash) {
        if (hash === undefined)
            return res.status(400).json({ message: "user not found" });

        bcrypt.compare(password, hash, function (err, result) {
            if (err) {
                res.status(400).json({ message: err });

            }
            if (result) {
                isLoggedIn = true;
                res.status(200).json({ message: `Logged ${userInfo.email} in successfuly` });
            } else {
                res.status(400).json({ message: "incorrect password" });
            }
        })
    }
});

app.patch("/api/user/update", checkAcess, async (req, res) => {

    const data = req.body;
    const { firstName, lastName, userName, email, password, picture } = data
    let result = {}

    if (firstName !== "" && firstName !== undefined) {
        logger(firstName);
        result = await UpdateUser(email, { firstName });
    }
    if (lastName !== undefined && lastName !== null) {
        logger(lastName);
        result = await UpdateUser(email, { lastName });
    }
    if (password !== "" && password !== undefined) {
        logger(password);
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            logger(hash);
            await UpdateUser(email, { password: hash });
        });
    }
    if (picture !== "" && picture !== undefined) {
        logger(picture);
        result = await UpdateUser(email, { picture });
    }
    if (userName !== "" && userName !== undefined) {
        logger(userName);
        result = await UpdateUser(email, { userName });
    }

    res.status(200).json({ message: "profile updated", user: result.data, error: result.error });
});

app.post("/api/user/message", checkAcess, async (req, res) => {

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

app.get("/api/user/inbox", checkAcess, async (req, res) => {
    const response = await GetMessages(userInfo.email);

    if (response.length == 0) {
        res.status(200).json({ response: "no new mail" });
    } else {
        const msg = response.filter((data, index) => {
            if (data.length >= 1) {
                return data[index];
            }
        });
        res.status(200).json(msg);
    }
});

app.post("/api/user/report", Message, checkAcess, async (req, res) => {
    const id = req.body.id;

    const response = await ReportMessage(id);

    res.status(200).json({ response });
});


app.listen(port, () => {
    logger("listening on port " + port);
})


const logger = function (value) {
    return console.log(value);
}

function checkAcess(req, res, next) {
    if (!isLoggedIn) {
        res.status(400).json({ message: "error not logged in" });
        return next;
    }
    next();
}


function validateDetail(req, res, next) {
    const { email, password } = req.body;

    if (email == undefined || email == "") {
        res.message = "email cannnot be empty";
        res.status(400).json({ message: res.message });
        logger(res.message);
        return;
    }

    if (password == undefined || password == "") {
        res.message = "password cannot be empty";
        res.status(400).json({ message: res.message });
        logger(res.message);
        return
    }

    userInfo.email = email;
    next();
}

function Message(req, res, next) {
    res.status(400).json({ message: "This route is underdevelopement" });
}
