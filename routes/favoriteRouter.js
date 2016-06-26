let express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Favorites = require('../models/favorites'),
    Verify = require('./verify');

let favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .all(Verify.verifyOrdinaryUser)
    .get(function(req, res, next){
        console.log('Will send all the favorites to you!');
        Favorites.find({})
            .populate('postedBy')
            .populate('dishes')
            .exec(function(err, favorites){
            if(err) throw err;
            res.json(favorites);
        });
    })
    .post(function(req, res, next){
        console.log('Will add the favorite: ' + req.body._id);
        Favorites.findOne({"postedBy": req.decoded._doc._id},function(err, fav){
            if(err) throw err;
            if(fav.length === 0){
                console.log('perro');
                fav2 = {
                    postedBy:req.decoded._doc._id,
                    dishes:[req.body._id]
                };
                Favorites.create(fav2, function(err, favorite){
                    if(err) throw err;
                    console.log('Favorite created');
                    res.json(favorite);
                });
            }
            else{
                fav.dishes.push(req.body._id);
                fav.save(function(err, fav){
                    if(err) throw err;
                    console.log('favorite added');
                    res.json(fav);
                });
            }
        });
    })
    .delete(function(req, res, next){
        console.log('Delete all');
        Favorites.remove({}, function(err, resp){
            if(err) throw err;
            res.json(resp);
        });
    });

favoriteRouter.route('/:favoriteId')
    .all(Verify.verifyOrdinaryUser )
    .delete(function(req, res, next){

        console.log('Will delete the favorite: ' + req.body._id);
        Favorites.findOne({"postedBy": req.decoded._doc._id},function(err, fav){
            if(err) throw err;
            console.error("este el el fav: ",fav);
            if(fav.length === 0){
                let err = new Error('There is no favorite');
                res.status(500);
                return next(err);
            }
            else{
                let pos;
                for (var i = 0; i < fav.dishes.length; i++) {
                    if(fav.dishes[i].toString() === req.body._id.toString()){
                        pos=i;
                        break;
                    }
                }
                if(pos){
                    fav.dishes.splice(pos, 1);
                    fav.save(function(err, fav){
                        if(err) throw err;
                        console.log('favorite added');
                        res.json(fav);
                    });
                }
                else{
                    let err = new Error('There is no dish');
                    res.status(500);
                    return next(err);
                }
            }
        });
    });

module.exports = favoriteRouter;