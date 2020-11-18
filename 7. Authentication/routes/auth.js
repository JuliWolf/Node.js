const express = require('express');
const {check, body} = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup' , authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup',
    [
        check('email')
            .custom((value) => {
                // if(value === 'test@test.com'){
                //     throw new Error('This email address is forbidden');
                // }
                // return true;
                return User.findOne({email: value})
                    .then(userDoc => {
                        if(userDoc){
                            return Promise.reject('E-mail exists already. Please pick a different one');
                        }
                    })
            })
            .isEmail()
            .withMessage('Please enter a valid email')
        ,
        body('password', 'Please enter a password wuth only numbers and text at least 5 characters.')
            .isLength({min: 5})
            .isAlphanumeric(),
        body('confirmedPassword')
            .custom((value, {req}) => {
                if(value !== req.body.password){
                    throw new Error('Password have to match!');
                }
                return true;
            })
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;