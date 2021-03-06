const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        pathName: '/admin/add-product',
        productsCSS: true,
        formsCSS: true,
        activeAddProduct: true
    });
});

router.post('/product', (req,res, next) => {
    products.push({title: req.body.title})
    res.redirect('/');
});

exports.routes = router;
exports.products = products;