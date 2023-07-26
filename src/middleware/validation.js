var expressValidations = require('express-validations');

function checkAcess(req, res, next) {
    const isLoggedIn = req.cookies?.userInfo?.logInStatus;
    if (!isLoggedIn) {
        res.status(400).json({ message: "error not logged in" });
        return next;
    }
    next();
}


function validateDetail(req, res, next) {
    const { email, password } = req.body;

    if (!expressValidations.isValidEmail(email)) {
        res.message = `${email} is not a valid email address`;
        res.status(400).json({ message: res.message });
        console.log(res.message);
        return;
    }

    if (password === "" || password === undefined) {
        res.message = "password cannot be null";
        res.status(400).json({ message: res.message });
        console.log(res.message);
        return
    }

    next();
}

module.exports = {
    checkAcess,
    validateDetail
}