// const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRouter = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));


app.use('/admin',adminRoutes);
app.use(shopRouter);

app.use('/', (req, res, next) => {
    res.status(404).send('<h1>Page not Found</h1>');
});

// const server = http.createServer(app);
// server.listen(3000);

// Alternative
app.listen(3000);

