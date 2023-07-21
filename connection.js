const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017";
const userDBName = "records";
const connectionString = url + "/" + userDBName;



function RunUserDB() {
    const client = mongoose.connect(connectionString).then(() => {
        console.clear();
        console.log("Connected to userDB");
    }).catch((error) => {
        console.log(error);
    })
}


module.exports = { RunUserDB };
