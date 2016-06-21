let mongoose = require('mongoose');
// load the currency mongoose data type
require('mongoose-currency').loadType(mongoose);
let Currency = mongoose.Types.Currency;

let Schema = mongoose.Schema;

let commentsSchema = new Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

let dishSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
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
    comments:[commentsSchema]
},{
    timestamps:true // this atribute gives the object two new values, created at and updated at
});

let Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;