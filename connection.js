const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017";
const dbName = "records";
const connectionString = url + "/" + dbName;


const client = mongoose.connect(connectionString).then(() => {
    console.log("Connected");
}).catch((error) => {
    console.log(error);
})


module.exports = { client }
