'use strict'

const passport = require('passport');

const auth = require('../helpers/auth');
const httpResponse = require('../helpers/http_response');
const statusCode = require('../helpers/status_code');
const dataValidation = require('../helpers/data_validation');
const User = require('../models/user');

const FacebookAuth = passport.authenticate('facebook',  { session: false });

module.exports.controller = app => {
    /**
     * SIGN IN LOCAL
     */
    app.post('/auth/signin', (req, res, next) => {
        return auth.requireSignIn(req, res, next);
    });

    /**
     * SIGN IN FACEBOOK
     */
    app.get('/auth/facebook', FacebookAuth);
    app.get('/auth/facebook/callback', FacebookAuth, function(req, res) {
        const token = auth.generateToken(user);
        res.send({ user: req.user, token })
    });

    /**
     * SIGN UP
     */
    app.post('/auth/signup', (req, res) => {
        const userData = _.pick(req.body, ['email', 'password', 'firstName', 'lastName']);
        const newUser = new User(userData);

        const validationSchema = dataValidation.getMongooseErrorMessagesList(newUser.validateSync());
        if (validationSchema)
            return httpResponse.wrong(res, statusCode.error.BAD_REQUEST, "Something is wrong with the fields", validationSchema);

        // Try to find the user on the database
        User.findOne({ email: userData.email }) 
        .then(user => {            
            // Check if email is already in use
            if (user)
                return httpResponse.wrong(res, statusCode.error.CONFLICT, `The email '${userData.email}' is already in use`);

            // Save the user on db
            newUser.save()
            .then(user => {
                // Respond the request indicating that the user was created
                const token = auth.generateToken(user);
                return httpResponse.success(res, "The user was successfully created", { user, token }, statusCode.success.CREATED)
            })
            .catch(err => {
                return httpResponse.error(res, err, "Error while saving the user on the database");
            })
        })
        .catch(err => {
            return httpResponse.error(res, err, "Error while finding the user on the database");
        });
    });
}
