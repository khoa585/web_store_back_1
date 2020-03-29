let Product = require('./../Models/Db_Product');
let ResponsiveHelper = require('./../commons/ResponsiveHelper');
module.exports.Products = async function (req, res) {
		let Products = await Product.find();
		res.json(Products);
}
module.exports.create_Pd = async function (req, res) {
	let result = await req.files.map((img)=>{
		let imgs = img.path.replace(/uploads\\/g,'');
		return imgs;
	})
	let Products = await new Product({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		sale: req.body.sale,
		star: req.body.star,
		productImage: result
	})
	Products.save()
	res.json(Products);
}
module.exports.delete_Pd = async function (req, res) {
	let result = await Product.findOneAndRemove({ _id: req.params.id }, function (err, res) {
		if (err) throw err;
	})
	return ResponsiveHelper.json(req, res, null, result);
}