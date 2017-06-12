'use strict'

const passport = require('passport');
const httpResponse = require('./http_response');
const statusCode = require('./status_code');
const User = require('../models/user');

function requireSignIn(req, res, next) {
    passport.authenticate('local', { session: false }, (err, email, password) => {
        // Try to find the user on the database
        User.findOne({ email: email })
        .then(user => {
            // If the user doesn't exist
            if (!user) return httpResponse.wrong(res, statusCode.error.CONFLICT, `The email doesn't exist`);

            // Compare passwords
            user.comparePassword(password, (err, isMatch) => {
                if (err) return httpResponse.error(res, err, "Error while comparing user's password");

                // If it isn't correct
                if (!isMatch) return httpResponse.wrong(res, statusCode.error.CONFLICT, `Invalid password`);
                
                 // If it's correct
                req.login(user, loginErr => {
                    if (loginErr) return httpResponse.error(res, loginErr, 'Error while login in the user on the session');

                    return httpResponse.success(res, 'authentication succeeded', user);
                });      
            })
        })
        .catch(err => {
            return httpResponse.error(res, err, 'Error while finding the user on database');
        })
    })(req, res, next);
}

const passportService = require('../services/passport');
module.exports = { requireSignIn }