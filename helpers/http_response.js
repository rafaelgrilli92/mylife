'use strict'

/**
 * Creates a success message to respond to the client
 * @param {object} res The response object
 * @param {*} [data={}] 
 * @param {number} [statusCode=200] 
 * @param {string|string[]} [message]
 */
 function success(res, message, data = {}, statusCode = 200) {
    return res.status(statusCode).send({
        status: statusCode,
        data,
        message
    });
};

/**
 * Creates an error message to respond to the client when something expected happens
 * @param {object} res The response object
 * @param {number} statusCode
 * @param {string} message - Text containing a description for error or a generic description when it has more than one error
 * @param {string[]} [list] - An array containing a description for each error
 */
function wrong(res, statusCode, message, list) {
    return res.status(statusCode).send({
        status: statusCode,
        error: {
            type: 'EXPECTED',
            message,
            list
        }
    });
};

/**
 * Creates an error message to respond to the client when something unexpected happens
 * @param {object} res The response object
 * @param {object} err The error object that was returned
 * @param {string} [message=Something went wrong] - Error description
 * @param {number} [statusCode=500]
 */
function error(res, err, message = "Something went wrong", statusCode = 500) {
    log.error(`${message}\n${err.stack}`);
    let errorObject = {
        status: statusCode,
        error: {
            type: 'UNEXPECTED',
            description: err.message,
            message
        }
    }

    if (process.env.NODE_ENV !== 'production')
        errorObject.error.stack = err.stack;

    return res.status(statusCode).send(errorObject);
};

module.exports = { 
    success, 
    wrong, 
    error 
};