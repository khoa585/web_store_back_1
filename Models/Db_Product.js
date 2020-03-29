var mongoose = require('mongoose');
var Db_pdSchema = new mongoose.Schema({
	name: String,
	description: String,
	price: String,
	sale: Boolean,
	star: String,
	productImage: Array,
});
var Db_Product = mongoose.model('products', Db_pdSchema, 'products');
module.exports = Db_Product;