let { decode } = require('./../commons/JWThelpers');
var user = require('./../Models/user');
let JWTauthen = async (req, res, next) => {
    let jwt = req.headers['Authorization'] || req.headers['authorization'];
    if (!jwt) return next();
    let payload = decode(jwt)
    let resultUser = await user.find({
        _id: payload.data
    })
    if (resultUser && payload) {
        req.user = {
            _id: resultUser[0]._id,
            username: resultUser[0].username,
        }
    }
    next();
    // if(req.session.use){
    //     const jwt = req.session.use.token;
    //     let payload = decode(jwt)
    //     let resultUser = await user.find({
    //         _id: payload.data
    //     })
    //     if (resultUser && payload) {
    //         req.user = {
    //             _id: resultUser[0]._id,
    //             username: resultUser[0].username,
    //         }
    //     }
    //     next();
    // }else{  
    //     return next()
    // }
};
module.exports = {
    JWTauthen
}
