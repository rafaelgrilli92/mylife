'use strict'

const console = process.console;
const defaultDevErrorMessage = "Something went wrong on the server";
const defaultClientErrorMessage = "Sorry, something went wrong on the server :(";
/**
 * Creates a success message to respond to the client
 * @param {object} res The response object
 * @param {*} data 
 * @param {number} [statusCode=200] 
 * @param {string|string[]} [message]
 */
 function success(res, message, data, statusCode = 200) {
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
 * @param {string|string[]} [clientError=Something went wrong] - Text or array containing a description for each error for the 'end user'
 * @param {string} [devError] - Description for developers
 */
function wrong(res, statusCode, clientError, devError) {
    if (!clientError || typeof clientError === "undefined")
        clientError = defaultClientErrorMessage;

    if (!devError || typeof devError === "undefined")
        devError = clientError;

    return res.status(statusCode).send({
        status: statusCode,
        error: {
            type: 'EXPECTED',
            clientError,
            devError
        }
    });
};

/**
 * Creates an error message to respond to the client when something unexpected happens
 * @param {object} res The response object
 * @param {string|object} fullError The full error that was returned
 * @param {string} [devError=Something went wrong] - Description for developers
 * @param {number} statusCode
 * @param {string|string[]} [clientError=Something went wrong] - Text or array containing a description for each error to show to the end user
 */
function error(res, fullError, devError = defaultDevErrorMessage, statusCode = 500, clientError = defaultClientError) {
    return res.status(statusCode).send({
        status: statusCode,
        error: {
            type: 'UNEXPECTED',
            fullError,
            devError,
            clientError
        }
    });
};

module.exports = { 
    success, 
    wrong, 
    error 
};