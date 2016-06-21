let express = require('express'),
    bodyParser = require('body-parser'),
    Leaders = require('../models/leadership'),
    Verify = require('./verify');

let leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function(req, res, next){
        console.log('Will send all the leaders to you!');
        Leaders.find({}, function(err, leader){
            if(err) throw err;
            res.json(leader);
        });
    })
    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        console.log('Will add the leader: ' + req.body.name +' with details: ' + req.body.description);
        Leaders.create(req.body, function(err, leader){
            if(err) throw err;
            console.log('leader created');
            let id = leader._id;
            res.writeHead(200, {'Content-Type':'text/plain'});
            res.end('Added the leader: '+id);
        });
    })
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        console.log('Delete all');
        Leaders.remove({}, function(err, resp){
            if(err) throw err;
            res.json(resp);
        });
    });

leaderRouter.route('/:leaderId')
    .get(Verify.verifyOrdinaryUser, function(req, res, next){
        console.log('Will send details of the leader: ' + req.params.leaderId + ' to you');
        Leaders.findById(req.params.leaderId, function(err, leader){
            if(err) throw err;
            res.json(leader);
        });
    })
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        console.log('Updating the leader: ' + req.params.leaderId + '\n');
        Leaders.findByIdAndUpdate(req.params.leaderId, {$set:req.body}, {new:true}, function(err, leader){
            if(err) throw err;
            res.json(leader);
        });
    })
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        console.log('Deleting leader with id: '+req.params.leaderId);
        Leaders.findByIdAndRemove(req.params.leaderId, function(err, resp){
            if(err) throw err;
            res.json(resp);
        });
    });

module.exports = leaderRouter;