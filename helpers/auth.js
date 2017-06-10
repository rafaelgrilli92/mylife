'use strict'

const passport = require('passport');
const httpResponse = require('./http_response');
const statusCode = require('./status_code');
const User = require('../models/user');

function requireSignIn(req, res, next) {
    passport.authenticate('local', { session: false }, (err, email, password) => {
        // Try to find the user on the database
        User.findOne({ email: email }, (err, user) => {
            if (err) return done(err);

            // If the user doesn't exist
            if (!user) return httpResponse.wrong(res, statusCode.error.CONFLICT, `The email ${email} doesn't exist`);

            // Compare passwords
            user.comparePassword(password, (err, isMatch) => {
                if (err) return done(err);

                // If it isn't correct
                if (!isMatch) return done(null, false);
                
                 // If it's correct
                req.login(user, loginErr => {
                    if (loginErr) {
                        return next(loginErr);
                    }
                    return res.send({ success : true, message : 'authentication succeeded' });
                });      
            })
        })
    })(req, res, next);
}

const passportService = require('../services/passport');
module.exports = { requireSignIn }