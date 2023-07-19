const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const client = require("./connection");
const { User, CreateUser, FindUser, UpdateUser } = require("./user");

const app = express();

const port = 3000;

let isLoggedIn = true;

app.use(bodyParser.urlencoded({ extended: true }));

///Database server
client;

app.post("/api/register", async (req, res) => {
    const data = req.body;

    const { email, password } = data;

    validateDetail(email, res, password);

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

app.post("/api/login", (req, res) => {
    const data = req.body;

    const { email, password } = data;

    validateDetail(email, res, password);

    FindUser(email, password, validator).then((result) => {
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
                res.status(200).json({ message: "Logged in successfuly" });
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
        result = await UpdateUser(email, { password });
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

app.post("/api/user/message", checkAcess, (req, res) => {
});

app.get("/api/user/inbox", checkAcess, (req, res) => {

});

app.post("/api/user/report", checkAcess, (req, res) => {

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


function validateDetail(email, password, res) {
    if (email == undefined || email == "")
        return res.status(400).json({ message: "email cannnot be empty" });
    if (password == undefined || password == "")
        return res.status(400).json({ message: "password cannot be empty" });
}
/*
TODO-> add database for user
TODO-> implement authentication, login and session management with password hashing and salting.
TODO-> allow users to update their profile
*/
