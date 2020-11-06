const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice, cb){
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0}
            if(!err){
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updateProduct;
            if(existingProduct){
                updateProduct = {
                    ...existingProduct,
                    quantity: existingProduct.quantity + 1
                };
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updateProduct;
            }else{
                updateProduct = {id: id, quantity: 1};
                cart.products = [...cart.products, updateProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if(!err){
                    cb();
                }
                console.log(err);
            });
        });
    }

    static deleteProduct(id, productPrice, cb){
        fs.readFile(p, (err, fileContent) => {
           if(err) {
               return;
           }
           const updatedCart = {...JSON.parse(fileContent)};
           const product = updatedCart.products.find(prod => prod.id == id);
           console.log(product)
           const productQuantity = product.quantity;
           updatedCart.products = updatedCart.products.filter(product => product.id != id);
           updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQuantity;
            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                if(!err){
                    cb()
                }
                console.log(err);
            });
        });
    }

}