let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let leadershipSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    abbr:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{
    timestamps:true // this atribute gives the object two new values, created at and updated at
});

let Leadership = mongoose.model('Leadership', leadershipSchema);

module.exports = Leadership;