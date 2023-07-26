const port = 3000;

let isLoggedIn = false;


const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const client = require("./src/config/connection");
const { userRouter } = require("./src/routes/v1/userRoute");
const { validateDetail } = require("./src/middleware/validation");
const { FindUser } = require("./src/controller/userController");
const { Secure, Compare } = require("./src/helper/password");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", userRouter);

client.RunUserDB();

const userInfo = {
    email: "",
}

app.post("/api/v1/register", validateDetail, async (req, res) => {
    const data = req.body;

    const { email, password } = data;

    const status = await Secure(saltRounds, password, onError, onSucess);

    function onError() {
        console.log(err);
        res.status(400).json({ message: err })
    }

    function onSucess(hash) {
        CreateUser(email, hash);

        res.status(201).json({ message: "user created successfully" });
        SaveSession(res, email);
    }

    if (status.result) {
    }
});

app.post("/api/v1/login", validateDetail, async (req, res) => {

    if (res.message) {
        const { message } = res;
        console.log(message);
        res.status(400).json({ message });
    }

    const data = req.body;

    const { email, password } = data;

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

        function onSucess(result) {
            res.clearCookie("userInfo");
            if (result) {
                SaveSession(res, email);
                res.status(200).json({ message: `Logged ${email} in successfuly` });
            } else {
                res.status(400).json({ message: "incorrect password" });

            }
        }
    }
});


function SaveSession(res, email) {
    isLoggedIn = true;
    res.cookie("userInfo", {
        logInStatus: isLoggedIn,
        email: email,
    }, { expire: 600000 + Date.now() });
}


app.listen(port, () => {
    console.log("listening on port " + port);
})
