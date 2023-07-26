require('dotenv').config();
const mongoose = require("mongoose");

const url = process.env.DATABASE_URL;
const databaseName = "chatApp";
const connectionString = url + "/" + databaseName;



function RunUserDB() {
    const client = mongoose.connect(connectionString).then(() => {
        console.log("Connected to userDB");
    }).catch((error) => {
        console.log(error);
    })
}


module.exports = { RunUserDB };
