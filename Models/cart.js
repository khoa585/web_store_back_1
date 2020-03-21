var mongoose = require('mongoose')
var cartSchema = new mongoose.Schema({
    idUser: String,
    cart: [{
        idProduct: String,
        nameProduct : String,
        quantity: String,
        price: String,
        sale : String
    }]
});
var cartProduct = mongoose.model('cartProduct', cartSchema, 'cartProduct');
module.exports = cartProduct;