const bcrypt = require('bcryptjs');

const helpers = require('../utils/helpers');
const User = require('../models/user');


exports.signup = (req, res, next) => {
    helpers.checkErrorsHandler(req);

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email,
                password: hashedPw,
                name
            });
            return user.save();
        })
        .then(result => {
            res.status(201)
                .json({
                    message: "User created!",
                    userId: result._id
                })
        })
        .catch((err) => helpers.catchErrorHandler(err, next));
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
        .then(user => {
            helpers.checkElemHandler(user, 'A user with this email could not be found.', 401);
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            helpers.checkElemHandler(isEqual, 'Wrong password!', 401);

        })
        .catch((err) => helpers.catchErrorHandler(err, next));
};