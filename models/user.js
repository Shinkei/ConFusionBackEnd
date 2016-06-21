let mongoose = require('mongoose'),
    passportLM = require('passport-local-mongoose'),
    Schema = mongoose.Schema;

let User = new Schema({
    username:String,
    password:String,
    admin:{
        type:Boolean,
        default:false
    }
});

User.plugin(passportLM);

module.exports = mongoose.model('User', User);