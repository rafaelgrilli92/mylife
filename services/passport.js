'use strict'

const passport = require('passport');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const facebookConfig = require('../configs').facebook;
const appConfig = require('../configs').app;

/**
 * JWT STRATEGY
 */
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: appConfig.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // See if the user ID in the payload exists in the DB
    User.findOne({ _id: payload.sub })
    .then(user => {
        if (user)
            return done(null, user, 'Valid Token');
        else
            return done(null, null, 'Invalid Token');
    })
    .catch(err => {
        return done(err);
    });
});

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
                 return done(err);
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

passport.use(jwtLogin);
passport.use(localLogin);
passport.use(facebookStrategy);