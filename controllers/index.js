'use strict'

module.exports.controller = function(app) {
    /**
     * Index Route
     */
    app.get('/', function(req, res) {
        res.send({ message: 'index route' })
    });
}
