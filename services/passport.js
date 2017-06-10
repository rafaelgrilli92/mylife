const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

/**
 * LOCAL STRATEGY
 */
const localLoginOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localLoginOptions, function(email, password, done) {
    return done(null, email, password);
    // // Try to find the user on the database
    // User.findOne({ email: email }, function(err, user) {
    //     if (err) return done(err);

    //     // If the user doesn't exist
    //     if (!user) return done(null, false);

    //     // Compare passwords
    //     user.comparePassword(password, function(err, isMatch) {
    //         if (err) return done(err);

    //         // If it isn't correct
    //         if (!isMatch) return done(null, false);
            
    //          // If it's correct
    //         return done(null, user);
    //     })
    // })
});

passport.use(localLogin);