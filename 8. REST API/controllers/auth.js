const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'secret', {expiresIn: '1h'});
            res.status(200)
                .json({
                    token,
                    userId: loadedUser._id.toString()
                })
        })
        .catch((err) => helpers.catchErrorHandler(err, next));
};

exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            helpers.checkElemHandler(user, 'User not found');
            res.status(200)
                .json({
                    status: user.status
                })
        })
        .catch((err) => helpers.catchErrorHandler(err, next));
};

exports.updateUserStatus = (req, res, next) => {
    const newStatus = req.body.status;
    User.findById(req.userId)
        .then(user => {
            helpers.checkElemHandler(user, 'User not found');
            user.status = newStatus;
            return user.save();
        })
        .then(result => {
            res.status(200)
                .json({
                    message: 'User updated.'
                })
        })
        .catch((err) => helpers.catchErrorHandler(err, next));
};