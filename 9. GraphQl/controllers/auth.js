const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const helpers = require('../utils/helpers');
const User = require('../models/user');


exports.signup = async (req, res, next) => {
    helpers.checkErrorsHandler(req);

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    try {
        const hashedPw = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            password: hashedPw,
            name
        });
        const result = await user.save();
        res.status(201)
            .json({
                message: "User created!",
                userId: result._id
            });
    }catch(err){
        helpers.catchErrorHandler(err, next)
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email: email});
        helpers.checkElemHandler(user, 'A user with this email could not be found.', 401);
        const isEqual = await bcrypt.compare(password, user.password);
        helpers.checkElemHandler(isEqual, 'Wrong password!', 401);
        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        }, 'secret', {expiresIn: '1h'});
        res.status(200)
            .json({
                token,
                userId: user._id.toString()
            });
    }catch(err){
        helpers.catchErrorHandler(err, next)
    }
};

exports.getUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        helpers.checkElemHandler(user, 'User not found');
        res.status(200)
            .json({
                status: user.status
            })
    }catch(err){
        helpers.catchErrorHandler(err, next);
    }
};

exports.updateUserStatus = async (req, res, next) => {
    const newStatus = req.body.status;
    try{
        const user = await User.findById(req.userId);
        helpers.checkElemHandler(user, 'User not found');
        user.status = newStatus;
        await user.save();
        res.status(200)
            .json({
                message: 'User updated.'
            })
    }catch(err){
        helpers.catchErrorHandler(err, next)
    }
};