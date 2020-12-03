const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');

exports.clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};

exports.catchErrorHandler = (err, next) => {
    condole.log(err);
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
};

exports.checkElemHandler = (item, message, statusCode) => {
    if(!item){
        const error = new Error(message);
        error.statusCode = statusCode || 404;
        throw error;
    }
};

exports.checkFileHandler = (req) => {
    if(!req.file){
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
};

exports.checkErrorsHandler = (req) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
};