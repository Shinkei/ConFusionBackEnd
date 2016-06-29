let express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Dishes = require('../models/dishes'),
    Verify = require('./verify');

let dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get(function(req, res, next){
        console.log('Will send all the dishes to you!');
        Dishes.find(req.query)
            .populate('comments.postedBy')
            .exec(function(err, dish){
            if(err) next(err);
            res.json(dish);
        });
    })
    .post(Verify.verifyOrdinaryUser ,Verify.verifyAdmin, function(req, res, next){
        console.log('Will add the dish: ' + req.body.name +' with details: ' + req.body.description);
        Dishes.create(req.body, function(err, dish){
            if(err) next(err);
            console.log('Dish created');
            let id = dish._id;
            res.writeHead(200, {'Content-Type':'text/plain'});
            res.end('Added the dish: '+id);
        });
    })
    .delete(Verify.verifyOrdinaryUser ,Verify.verifyAdmin, function(req, res, next){
        console.log('Delete all');
        Dishes.remove({}, function(err, resp){
            if(err) next(err);
            res.json(resp);
        });
    });

dishRouter.route('/:dishId')
    .get(function(req, res, next){
        console.log('Will send details of the dish: ' + req.params.dishId + ' to you');
        Dishes.findById(req.params.dishId)
            .populate('comments.postedBy')
            .exec(function(err, dish){
            if(err) next(err);
            res.json(dish);
        });
    })
    .put(Verify.verifyOrdinaryUser ,Verify.verifyAdmin, function(req, res, next){
        console.log('Updating the dish: ' + req.params.dishId + '\n');
        Dishes.findByIdAndUpdate(req.params.dishId, {$set:req.body}, {new:true}, function(err, dish){
            if(err) next(err);
            res.json(dish);
        });
    })
    .delete(Verify.verifyOrdinaryUser ,Verify.verifyAdmin, function(req, res, next){
        console.log('Deleting dish with id: '+req.params.dishId);
        Dishes.findByIdAndRemove(req.params.dishId, function(err, resp){
            if(err) next(err);
            res.json(resp);
        });
    });

dishRouter.route('/:dishId/comments')
    .get(function (req, res, next) {
        Dishes.findById(req.params.dishId)
            .populate('comments.postedBy')
            .exec(function (err, dish) {
            if (err) throw err;
            res.json(dish.comments);
        });
    })
    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            req.body.postedBy = req.decoded._id; //set the user's id in the comment
            dish.comments.push(req.body);
            dish.save(function (err, dish) {
                if (err) throw err;
                console.log('Updated Comments!');
                res.json(dish);
            });
        });
    })
    .delete(Verify.verifyOrdinaryUser ,Verify.verifyAdmin, function (req, res, next) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            for (var i = (dish.comments.length - 1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save(function (err, result) {
                if (err) throw err;
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all comments!');
            });
        });
    });

dishRouter.route('/:dishId/comments/:commentId')
    .all(Verify.verifyOrdinaryUser)
    .get(function (req, res, next) {
        Dishes.findById(req.params.dishId)
            .populate('comments.postedBy')
            .exec(function (err, dish) {
            if (err) throw err;
            res.json(dish.comments.id(req.params.commentId));
        });
    })
    .put(function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Dishes.findById(req.params.dishId, function (err, dish) {
            if (err) throw err;
            dish.comments.id(req.params.commentId).remove();
            req.body.postedBy = req.decoded._id;
            dish.comments.push(req.body);
            dish.save(function (err, dish) {
                if (err) throw err;
                console.log('Updated Comments!');
                res.json(dish);
            });
        });
    })
    .delete(function (req, res, next) {
        Dishes.findById(req.params.dishId, function (err, dish) {
            // check if the user that wants to delete is the owner of the comment
            if (dish.comments.id(req.params.commentId).postedBy.toString() !== req.decoded._id) {
                let err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }

            dish.comments.id(req.params.commentId).remove();
            dish.save(function (err, resp) {
                if (err) throw err;
                res.json(resp);
            });
        });
    });

module.exports = dishRouter;