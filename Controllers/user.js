var user = require('./../Models/user');
let checkLogin = async (data) => {
    let User = await user.find({
        username: data.username,
        password: data.password,
    })
    return User;
}
module.exports = {
    checkLogin
}