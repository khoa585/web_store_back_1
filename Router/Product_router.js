let express = require('express')
let router = express.Router()
let multer = require('multer');
let user = require('./../Models/user');
let { checkLogin } = require('./../Controllers/user');
let ResponsiveHelper = require('./../commons/ResponsiveHelper');
let ErrorEC = require('./../contants/error')
let { getToken } = require('./../commons/JWThelpers');
let Db_Product = require('../Models/Db_Product');
let cartProduct = require('../Models/cart');
let Product = require('./../Models/Db_Product');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'date-' + new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
const upload = multer({ storage: storage })
let controller = require('../Controllers/Product_controller')
router.get("/", (req, res) => {
    res.render('Product_api');
})
router.get('/Product_api', controller.Products)
router.post('/Product_api', upload.array('productImage'), controller.create_Pd)

router.post('/removeAll_Product', (req, res) => {
    Product.deleteMany({}, (err, docs) => {
        if (err) {
            return ResponsiveHelper.json(req, res, err, null);
        }
        return ResponsiveHelper.json(req, res, null, 'SUCCESS');
    })
})

router.delete('/Product_api/:id', controller.delete_Pd)
router.post('/login', async (req, res) => {
    let result = await checkLogin(req.body);
    if (result.length > 0) {
        token = getToken(result[0]._id);
        result['info'] = {
            username: result[0].username,
            token
        }
        req.session.use = {
            type: result[0].username,
            token: token
        }
        return ResponsiveHelper.json(req, res, null, result['info']);
    } else {
        return ResponsiveHelper.json(req, res, ErrorEC.LOGIN_FAIL, null);
    }
})
router.get('/me', async (req, res) => {
    let result = req.user;
    console.log(result)
    return ResponsiveHelper.json(req, res, null, result);
})
router.post('/users', async (req, res) => {
    try {
        const newuser = new user();
        newuser.username = req.body.username
        newuser.password = req.body.password
        const nameExist = await user.findOne({ username: req.body.username });
        if (nameExist) return ResponsiveHelper.json(req, res, null, 'Email đã tồn tại');
        newuser.save()
        return ResponsiveHelper.json(req, res, null, newuser);
    } catch (error) {
        return ResponsiveHelper.json(req, res, error, null);
    }
})
router.post('/change_Password', async (req, res) => {
    let result = req.user;
    let returnUser = await user.find({
        username: result.username,
        password: req.body.curentpassword
    })
    if (returnUser) {
        const returnUpdate = await user.updateOne(
            {
                username: result.username,
                password: req.body.curentpassword
            },
            {
                $set: {
                    password: req.body.newpassword
                }
            }
        )
        if (returnUpdate.n === 0) {
            return ResponsiveHelper.json(req, res, ErrorEC.UPDATE_FAIL, null);
        } else {
            return ResponsiveHelper.json(req, res, null, 'SUCCESS');
        }
    }
})
router.post('/add/:id', async (req, res) => {
    let product_Id = req.params.id;
    let result = req.user;
    let Quantity = req.body.Quantity;
    let product = await Db_Product.find({ _id: product_Id }, (err, data) => {
        if (err) return err;
        return data;
    })
    if (result) {
        cartProduct.findOne({ 'cart.idProduct': product_Id }, (err, docs) => {
            if (err) {
                return ResponsiveHelper.json(req, res, err, null);
            } else {
                if (!docs) {
                    let Product = new cartProduct({
                        idUser: result._id,
                        cart: [{
                            idProduct: product[0]._id,
                            nameProduct: product[0].name,
                            quantity: 1,
                            price: product[0].price,
                            sale: product[0].sale
                        }]
                    })
                    Product.save();
                    return ResponsiveHelper.json(req, res, null, Product);
                } else {
                    if (Quantity) {
                        docs.cart[0].quantity = parseInt(docs.cart[0].quantity) + Quantity;
                        docs.cart[0].price = parseInt(docs.cart[0].price) * docs.cart[0].quantity;
                    } else {
                        docs.cart[0].quantity++;
                        docs.cart[0].price = parseInt(docs.cart[0].price) * docs.cart[0].quantity;
                    }
                    docs.save();
                    return ResponsiveHelper.json(req, res, null, docs);
                }
            }
        })
    }
})
router.post('/remove/:id', (req, res) => {
    let product_Id = req.params.id;
    cartProduct.findOneAndRemove({ 'cart.idProduct': product_Id }, (err, docs) => {
        if (err) {
            return ResponsiveHelper.json(req, res, err, null);
        }
        return ResponsiveHelper.json(req, res, null, 'SUCCESS');
    })
})
router.post('/removeAll', (req, res) => {
    cartProduct.deleteMany({}, (err, docs) => {
        if (err) {
            return ResponsiveHelper.json(req, res, err, null);
        }
        return ResponsiveHelper.json(req, res, null, 'SUCCESS');
    })
})

module.exports = router;