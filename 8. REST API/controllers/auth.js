const helpers = require('../utils/helpers');
const User = require('../models/user');


exports.signup = (req, res, next) => {
    helpers.checkErrorsHandler(req);

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
};