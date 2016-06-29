let express = require('express'),
    bodyParser = require('body-parser'),
    Promos = require('../models/promotions'),
    Verify = require('./verify');

let promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get(function(req, res, next){
        console.log('Will send all the promos to you!');
        Promos.find(req.query, function(err, promos){
            if(err) next(err);
            res.json(promos);
        });
    })
    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        console.log('Will add the promo: ' + req.body.name +' with details: ' + req.body.description);
        Promos.create(req.body, function(err, promo){
            if(err) next(err);
            console.log('promo created');
            let id = promo._id;
            res.writeHead(200, {'Content-Type':'text/plain'});
            res.end('Added the promo: '+id);
        });
    })
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        console.log('Delete all');
        Promos.remove({}, function(err, resp){
            if(err) next(err);
            res.json(resp);
        });
    });

promoRouter.route('/:promoId')
    .get(function(req, res, next){
        console.log('Will send details of the promo: ' + req.params.promoId + ' to you');
        Promos.findById(req.params.promoId, function(err, promo){
            if(err) next(err);
            res.json(promo);
        });
    })
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        console.log('Updating the promo: ' + req.params.promoId + '\n');
        Promos.findByIdAndUpdate(req.params.promoId, {$set:req.body}, {new:true}, function(err, promo){
            if(err) next(err);
            res.json(promo);
        });
    })
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        console.log('Deleting promo with id: '+req.params.promoId);
        Promos.findByIdAndRemove(req.params.promoId, function(err, resp){
            if(err) next(err);
            res.json(resp);
        });
    });

module.exports = promoRouter;