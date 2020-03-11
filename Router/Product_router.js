let express = require('express')
let router = express.Router()
let multer = require('multer');
var user = require('./../Models/user');
var { checkLogin } = require('./../Controllers/user');
let ResponsiveHelper = require('./../commons/ResponsiveHelper');
var ErrorEC = require('./../contants/error')
let { getToken } = require('./../commons/JWThelpers');
var user = require('./../Models/user');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'date-' + new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
const upload = multer({ storage: storage })
var controller = require('../Controllers/Product_controller')
router.get("/", (req, res) => {
    res.render('Product_api');
})
router.get('/Product_api', controller.Products)
router.post('/Product_api', upload.single('productImage'), controller.create_Pd)
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
            token : token
        }
        return ResponsiveHelper.json(req, res, null, result['info']);
    } else {
        return ResponsiveHelper.json(req, res, ErrorEC.LOGIN_FAIL, null);
    }
})
router.get('/me', async (req, res) => {
    let result = req.user;
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

module.exports = router;