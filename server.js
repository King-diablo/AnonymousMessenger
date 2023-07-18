const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const port = 3000;

let isLoggedIn = false;

app.use(bodyParser.urlencoded({ extended: true }));


app.post("/api/register", (req, res) => {
    const data = req.body;
});

app.get("/api/login", (req, res) => {
    const data = req.body;

    const email = data.email;
    const password = data.password;

    if (email == undefined || email == "") return
    res.status(400).json({ message: "email cannnot be empty" });;
    if (password == undefined || password == "") return
    res.status(400).json({ message: "password cannot be empty" });;

    res.status(200).json({ message: "Logged in successfuly" });
});

app.patch("/api/user/update", (req, res) => {

});

app.post("/api/user/message", (req, res) => {

});

app.get("/api/user/inbox", (req, res) => {

});

app.post("/api/user/report", (req, res) => {

});

app.listen(port, () => {
    logger("listening on port " + port);
})


const logger = function (value) {
    return console.log(value);
}

/*
TODO-> add database for user
TODO-> implement authentication, login and session management with password hashing and salting.
TODO-> allow users to update their profile
*/
