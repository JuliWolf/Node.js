const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const userData = require('./routes/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userData.routes);

app.use('/', (req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found', pathName: '404'});
});

app.listen(3000);