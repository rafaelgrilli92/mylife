'use strict'

const passportService = require('../services/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports.controller = app => {
    /**
     * Index Route
     */
    app.get('/', requireAuth, (req, res) => {
        res.send({ message: 'index route' })
    });
}
