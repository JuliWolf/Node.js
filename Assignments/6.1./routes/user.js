const express = require('express');

const router = express.Router();

const users = [];

router.get('/', (req, res, next) => {
    res.render('add-user', {
        pageTitle: 'Add User',
        pathName: '/'
    });
});

router.post('/add-user', (req, res, next) => {
    users.push({userName: req.body.userName});
    res.redirect('/user');
});

router.get('/user', (req, res, next) => {
    res.render('users', {
        pageTitle: 'Add User',
        pathName: '/user',
        users
    });
});

exports.routes = router;
exports.users = users;