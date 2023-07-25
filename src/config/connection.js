const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017";
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
