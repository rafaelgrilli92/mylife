'use strict'

const merge = require('merge');
const passport = require('passport');
const passportService = require('../services/passport');
const requireToken = passport.authenticate('jwt', { session: false });
const httpResponse = require('../helpers/http_response');
const statusCode = require('../helpers/status_code');
const dataValidation = require('../helpers/data_validation');
const auth = require('../helpers/auth');

const User = require('../models/user'); 

module.exports.controller = app => {
    /**
     * GET
     */
    app.get('/me', requireToken, (req, res) => { 
        const userId = req.user._id;

        User.findById(userId).populate(['createdBy', 'updatedBy'])
        .then(user => {
            if (!user) return httpResponse.wrong(res, statusCode.error.NOT_FOUND, `User was not found`);
                
            return httpResponse.success(res, "User successfully fetched", user)
        })
        .catch(err => {
            if (err.message.indexOf('Cast to ObjectId failed') !== -1)
                return httpResponse.success(res, "User was not found", null);

            return httpResponse.error(res, err, "Error while fetching the User data on the database");
        })
    });

    /**
     * PUT
     */
    app.put('/me', requireToken, (req, res) => { 
        const userId = req.user._id;
        const dataToUpdate = _.pick(req.body, ["firstName", "lastName", "phone", ]);
        User.findByIdAndUpdate(userId, { $set: dataToUpdate })
        .then(user => {
            if (!user) return httpResponse.wrong(res, statusCode.error.NOT_FOUND,`User was not found`);

            return httpResponse.success(res, null, null, statusCode.success.NO_CONTENT);
        })
        .catch(err => {
            return httpResponse.error(res, err, "Error while updating the User on the database");
        })
    });

    
}
