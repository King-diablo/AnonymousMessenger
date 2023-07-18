const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const port = 3000;


const UserData = {
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
}

app.use(bodyParser.urlencoded({ extended: true }));


app.post("/api/register", (req, res) => {
    const data = req.body;
});

app.post("/api/login", (req, res) => {

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
