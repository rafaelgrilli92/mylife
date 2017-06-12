'use strict'
const passport = require('passport');

//const requireSignIn = passport.authenticate('local', { session: false });
//const passportService = require('../services/passport');

const auth = require('../helpers/auth');
const httpResponse = require('../helpers/http_response');
const statusCode = require('../helpers/status_code');
const dataValidation = require('../helpers/data_validation');
const User = require('../models/user');

module.exports.controller = app => {
    /**
     * SIGN IN
     */
    app.post('/signin', (req, res, next) => {
        return auth.requireSignIn(req, res, next);
        //res.send({ success: 'You are authenticated.' })
    });


    /**
     * SIGN UP
     */
    app.post('/signup', (req, res) => {
        const userData = _.pick(req.body, ['email', 'password', 'firstName', 'lastName']);

        // Validate fields
        const validations = {
            email: ['required', 'email'],
            password: ['required'],
            firstName: ['required'],
            lastName: ['required']
        };

        const validationErrors = dataValidation(userData, validations);
        if (validationErrors)
            return httpResponse.wrong(
                res, 
                statusCode.error.BAD_REQUEST, 
                "Something is wrong with the fields",
                validationErrors
            )

        // Try to find the user on the database
        User.findOne({ email: userData.email }) 
        .then(user => {            
            // Check if email is already in use
            if (user)
                return httpResponse.wrong(res, statusCode.error.CONFLICT, `The email ${userData.email} is already in use`);

            // Save the user on db
            const newUser = new User(userData);
            newUser.save()
            .then(user => {
                // Respond the request indicating the user was created
                return httpResponse.success(res, "The user was successfully created", user, statusCode.success.CREATED)
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
