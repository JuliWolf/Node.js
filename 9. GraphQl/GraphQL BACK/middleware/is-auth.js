const jwt = require('jsonwebtoken');

const helpers = require('../utils/helpers');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    helpers.checkElemHandler(authHeader, 'Not authenticated.', 401);
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, 'secret')
    }catch(err){
        err.statusCode = 500;
        throw err;
    }

    helpers.checkElemHandler(decodedToken, 'Not authenticated.', 401);
    req.userId = decodedToken.userId;
    next();
};