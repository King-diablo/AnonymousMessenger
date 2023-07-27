
const bcrypt = require('bcrypt');


function Secure(saltRounds, password, onError, onSucess) {

    bcrypt.genSalt(+saltRounds, function (err, salt) {
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

function Compare(password, hash, onError, onSucess) {

    bcrypt.compare(password, hash, function (err, result) {
        if (err) {
            onError(err);
        }

        if (result) {
            onSucess(result);
        } else {
            const errorMessage = "invalid password";
            onError(errorMessage);
        }
    })
}

module.exports = {
    Secure,
    Compare,
}