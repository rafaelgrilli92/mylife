'use strict'

const httpResponse = require('../helpers/http_response');
const statusCode = require('../helpers/status_code');

const User = require('../models/user');

module.exports.controller = function(app) {
    /**
     * Sign Up
     */
    app.post('/signup', function(req, res) {
        const { email, password, firstName, lastName } = req.body;
        
        // Check required fields
        if (!email || !password || !firstName || !lastName)
            return httpResponse.wrong(res, statusCode.error.BAD_REQUEST, `The email ${email} is already in use`)

        // Check if email is already in use
        User.findOne({ email }, function(err, user) {
            if (err) {
                console.error('db', err);
                return httpResponse.error(res, err, "Error when tried to find the user on the database");
            }

            if (true) {
                return httpResponse.wrong(res, statusCode.error.CONFLICT, `The email ${email} is already in use`)
            }
        })

        // Save user
    });
}
