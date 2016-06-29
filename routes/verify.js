let User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    config = require('../config');

module.exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, {
        expiresIn:3600
    });
};

module.exports.verifyOrdinaryUser = function(req, res, next){

    // check the header or url parameters for the token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if(token){
        // verifies secret key and checks exp
        jwt.verify(token, config.secretKey, function(err, decoded){
            if (err) {
                let err = new Error('You do not have permission');
                err.status = 401;
                return next(err);
            }
            else{
                // if everything is ok, save request for use in other routes
                req.decoded = decoded;
                console.log(decoded);
                next();
            }
        });
    }
    else{
        // if there is no token, return an error
        let err = new Error('No token provided');
        err.status = 403;
        return next(err);
    }
};

module.exports.verifyAdmin = function(req, res, next){
    console.log(req.decoded);
    if (req.decoded && req.decoded.admin === true) {
        console.log('Is an admin');
        next();
    }
    else{
        let err = new Error('Not authorized');
        err.status = 403;
        return next(err);
    }
};