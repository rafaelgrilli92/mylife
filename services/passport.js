'use strict'

const passport = require('passport');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook');

const User = require('../models/user');
const facebookConfig = require('../configs/facebook');

/**
 * LOCAL STRATEGY
 */
const localLoginOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localLoginOptions, function(email, password, done) {
    return done(null, email, password);
});

/**
 * FACEBOOK STRATEGY
 */
const facebookStrategy = new FacebookStrategy(facebookConfig,
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ 'facebook.id': profile.id })
    .then(user => {
        if(!user) {
            user = new User({
                firstName: profile.displayName.split(' ')[0],
                lastName: profile.displayName.substr(profile.displayName.indexOf(' ') + 1),
                facebook: profile._json
            });
            // Saving user data to database
            user.save()
            .then(user => {
                return done(null, user);
            })
            .catch(err => {
                 return done(err, false);
            });
        } else {
            return done(null, user);
        }
    })
    .catch(err => {
        return done(err);
    });
  }
);

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        if(!err) done(null, user);
        else done(err, null)  
    })
});

passport.use(localLogin);
passport.use(facebookStrategy);