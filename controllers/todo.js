'use strict'

const passport = require('passport');
const passportService = require('../services/passport');
const requireToken = passport.authenticate('jwt', { session: false });

const httpResponse = require('../helpers/http_response');
const statusCode = require('../helpers/status_code');
const dataValidation = require('../helpers/data_validation');
const ToDo = require('../models/todo');

module.exports.controller = app => {
    /**
     * GET
     */
    app.get('/todo/:id?', requireToken, (req, res) => { 
        const todoId = req.params.id;
        const search = todoId ? ToDo.findById(todoId) : ToDo.find({});
        search.then(result => {
            if (!result) return httpResponse.success(res, "ToDo was not found", null);
                
            return httpResponse.success(res, "Data successfully fetched", result)
        })
        .catch(err => {
            if (err.message.indexOf('Cast to ObjectId failed') !== -1)
                return httpResponse.success(res, "Todo was not found", null);

            return httpResponse.error(res, err, "Error while fetching the ToDo data on the database");
        })
    });

    /**
     * POST
     */
    app.post('/todo', requireToken, (req, res) => { 
        const todoData = _.pick(req.body, ['title', 'items', 'dueData']);
        const newTodo = new ToDo(todoData);

        const validationSchema = dataValidation.getMongooseErrorMessagesList(newTodo.validateSync());
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
