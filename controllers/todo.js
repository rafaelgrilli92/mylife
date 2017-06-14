'use strict'

const merge = require('merge');
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
        const userId = req.user._id;
        const todoId = req.params.id;
        const search = todoId ? ToDo.findOne({ _id: todoId, createdBy: userId }) : ToDo.find({ createdBy: userId });
        search.populate(['createdBy', 'updatedBy'])
        .then(result => {
            if (!result) return httpResponse.wrong(res, statusCode.error.NOT_FOUND, `Data was not found`);
                
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
        const userId = req.user._id;
        const todoData = Object.assign({}, req.body, { createdBy: userId });
        const newTodo = new ToDo(todoData);

        const validationSchema = dataValidation.getMongooseErrorMessagesList(newTodo.validateSync());
        if (validationSchema)
            return httpResponse.wrong(res, statusCode.error.CONFLICT, "Something is wrong with the fields", validationSchema);

        newTodo.save()
        .then(todo => {
            return httpResponse.success(res, "The ToDo was successfully created", todo, statusCode.success.CREATED)
        })
        .catch(err => {
            return httpResponse.error(res, err, "Error while saving the ToDo on the database");
        })
    });

    /**
     * PUT
     */
    app.put('/todo/:id', requireToken, (req, res) => { 
        const userId = req.user._id;
        const todoId = req.params.id;

        ToDo.findOne({ _id: todoId, createdBy: userId })
        .then(todo => {
            if (!todo) return httpResponse.wrong(res, statusCode.error.NOT_FOUND,`Data was not found`);

            const todoData = merge(todo, req.body, { editedBy: userId });
            const newTodo = new ToDo(todoData);

            const validationSchema = dataValidation.getMongooseErrorMessagesList(newTodo.validateSync());
            if (validationSchema)
                return httpResponse.wrong(res, statusCode.error.CONFLICT, "Something is wrong with the fields", validationSchema);
            
            ToDo.update({ _id: todoId }, newTodo)
            .then(() => {
                return httpResponse.success(res, null, null, statusCode.success.NO_CONTENT);
            })
            .catch(err => {
                return httpResponse.error(res, err, "Error while updating the ToDo on the database");
            })
        })
        .catch(err => {
            return httpResponse.error(res, err, "Error while finding the ToDo on the database");
        })
    });

    /**
     * DELETE
     */
    app.delete('/todo/:id', requireToken, (req, res) => { 
        const userId = req.user._id;
        const todoId = req.params.id;
        
        ToDo.findOneAndRemove({ _id: todoId, createdBy: userId })
        .then(todo => {
            if (!todo) return httpResponse.wrong(res, statusCode.error.NOT_FOUND,`Data was not found`);

            return httpResponse.success(res, null, null, statusCode.success.NO_CONTENT)
        })
        .catch(err => {
            return httpResponse.error(res, err, "Error while deleting the ToDo on the database");
        })
    });
}
