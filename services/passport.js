const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

/**
 * LOCAL STRATEGY
 */
const localLoginOptions = { usernameField: 'email' };
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        if(!err) done(null, user);
        else done(err, null)  
    })
});
const localLogin = new LocalStrategy(localLoginOptions, function(email, password, done) {
    return done(null, email, password);
    // Try to find the user on the database
    User.findOne({ email: email })
    .then(user => {
        // If the user doesn't exist
        if (!user) return done(null, false);

        // Compare passwords
        user.comparePassword(password, (err, isMatch) => {
            if (err) return done(err);

            // If it isn't correct
            if (!isMatch) return done(null, false);
            
             // If it's correct
            return done(null, user);
        })
    })
    .catch(err => {
        return done(err);
    })
});

passport.use(localLogin);