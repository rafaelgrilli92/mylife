'use strict'

const passport = require('passport');
const passportService = require('../services/passport');
const requireToken = passport.authenticate('jwt', { session: false });

const httpResponse = require('../helpers/http_response');
const statusCode = require('../helpers/status_code');
const dataValidation = require('../helpers/data_validation');
const ToDo = require('../models/todo');

module.exports.controller = app => {
    app.post('/todo', requireToken, (req, res) => { 
        const todoData = _.pick(req.body, ['title', 'items', 'dueData']);
        const newTodo = new ToDo(todoData);

        const validationSchema = dataValidation(newTodo.validateSync());
        if (validationSchema)
            return httpResponse.wrong(res, statusCode.error.BAD_REQUEST, "Something is wrong with the fields", validationSchema);


        newTodo.save()
        .then(todo => {
            return httpResponse.success(res, "The ToDo was successfully created", todo, statusCode.success.CREATED)
        })
        .catch(err => {
            return httpResponse.error(res, err, "Error while saving the ToDo on the database");
        })
    });
}
