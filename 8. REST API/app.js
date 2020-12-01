const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const MONGODB_URI = 'mongodb+srv://Julia:92eqMJIDuktTc3tx@cluster0.atmea.mongodb.net/messages?retryWrites=true&w=majority';

const app = express();

// app.use(bodyParser.urlencoded()); // data from form
app.use(bodyParser.json()); //application/json
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status)
        .json({message})
});


mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err));
