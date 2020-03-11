var mongoose = require('mongoose');
var Db_user = new mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    tokens: [{
            type: String,
            required: true
    }]
})
var user = mongoose.model('user', Db_user, 'user');
module.exports = user;