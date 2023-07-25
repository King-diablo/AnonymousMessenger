
const bcrypt = require('bcrypt');


async function Secure(saltRounds, password, onError, onSucess) {

    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
            console.log(err);
            onError(err);
        }
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                console.log(err);
                onError(err);
            }
            onSucess(hash);
        })
    });

}

async function Compare(password, hash, onError, onSucess) {

    bcrypt.compare(password, hash, function (err, result) {
        if (err) {
            res.status(400).json({ message: err });
            onError(err);
        }

        if (result) {
            onSucess(result);
        }
    })
}

module.exports = {
    Secure,
    Compare,
}