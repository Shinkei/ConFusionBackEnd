let mongoose = require('mongoose');
// load the currency mongoose data type
require('mongoose-currency').loadType(mongoose);
let Currency = mongoose.Types.Currency;

let Schema = mongoose.Schema;

let promotionsSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    label:{
        type:String,
        required:false,
        default:''
    },
    price:{
        type:Currency,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true // this atribute gives the object two new values, created at and updated at
});

let Promotions = mongoose.model('Promotions', promotionsSchema);

module.exports = Promotions;