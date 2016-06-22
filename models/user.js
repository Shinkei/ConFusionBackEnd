let mongoose = require('mongoose'),
    passportLM = require('passport-local-mongoose'),
    Schema = mongoose.Schema;

let User = new Schema({
    username:String,
    password:String,
    firstname:{
        type:String,
        default:''
    },
    lastname:{
        type:String,
        default:''
    },
    admin:{
        type:Boolean,
        default:false
    }
});

User.methods.getName = function(){
    return (this.firstname+' '+this.lastname);
};

User.plugin(passportLM);

module.exports = mongoose.model('User', User);