'use strict'

const httpResponse = require('../helpers/http_response');
const statusCode = require('../helpers/status_code');
const dataValidation = require('../helpers/data_validation');

const User = require('../models/user');

module.exports.controller = function(app) {
    /**
     * Sign Up
     */
    app.post('/signup', function(req, res) {
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
            return httpResponse.wrong(res, statusCode.error.BAD_REQUEST, validationErrors)

        // Try to find the user on the database
        User.findOne({ email: userData.email }, function(err, user) {
            if (err) {
                const errDesc = "Error while finding the user on the database";
                console.error('db', errDesc, err);
                return httpResponse.error(res, err, errDesc);
            }
            
            // Check if email is already in use
            if (user) {
                return httpResponse.wrong(res, statusCode.error.CONFLICT, `The email ${userData.email} is already in use`)
            }

            // Save the user on db
            const newUser = new User(userData);
            newUser.save(function(err) {
                if (err) {
                    const errDesc = "Error while saving the user on the database";
                    console.error('db', errDesc, err);
                    return httpResponse.error(res, err, errDesc);
                }

                // Respond the request indicating the user was created
                return httpResponse.success(res, "The user was created successfully")
            });
        })
    });
}
