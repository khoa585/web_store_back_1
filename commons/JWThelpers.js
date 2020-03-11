let jwt = require('jsonwebtoken');
let secret = '151adw154411dwfva7596484awqcqfq';
const EXPIRESTIME = 30; //30 day
let getToken = (payload) => {
    if (!payload.createdAt) {
        payload.createdAt = new Date().getTime();
    }
    let token = jwt.sign({
        data: payload
    }, secret,
        { expiresIn: 30 * 24 * 60 * 60 }
    );
    return token;
}
let decode = (token) => {
    try {
        let decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        return null;
    }
}
module.exports = {
    getToken,
    decode
}