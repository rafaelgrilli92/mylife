'use strict'

module.exports.controller = app => {
    /**
     * Index Route
     */
    app.get('/', (req, res) => {
        res.send({ message: 'index route' })
    });
}
