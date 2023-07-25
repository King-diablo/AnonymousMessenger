
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

    if (email == undefined || email == "") {
        res.message = "email cannnot be empty";
        res.status(400).json({ message: res.message });
        console.log(res.message);
        return;
    }

    if (password == undefined || password == "") {
        res.message = "password cannot be empty";
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