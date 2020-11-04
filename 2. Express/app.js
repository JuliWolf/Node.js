// const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//register handlebar
// const expressHbs = require('express-handlebars');

const app = express();

//register handlebar
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}));
// app.set('view engine', 'hbs');

// set template engine and template dir
// app.set('view engine', 'pug');

//register ejs
app.set('view engine', 'ejs');

app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminData.routes);
app.use(shopRouter);

app.use('/', (req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found', pathName: '404'});
});

// const server = http.createServer(app);
// server.listen(3000);

// Alternative
app.listen(3000);

