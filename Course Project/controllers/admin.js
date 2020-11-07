const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.create({
        title,
        price,
        imageUrl,
        description
    }).then(result => {
        // console.log(result);
        console.log('Created Product');
    }).catch(err => {
        console.log(err)
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((row, fieldData) => {
            if(!row[0]){
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: row[0]
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDescription,
        updatedPrice
    );
    updatedProduct.save(() => {
        res.redirect('/admin/products');
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('admin/products', {
                prods: rows,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteByID(productId, () => {
        res.redirect('/admin/product');
    });
};
