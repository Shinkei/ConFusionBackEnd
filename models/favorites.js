let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let favoriteSchema = new Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    dishes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dish'
    }]
},{
    timestamps:true // this atribute gives the object two new values, created at and updated at
});

let Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;