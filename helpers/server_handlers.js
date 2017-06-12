const httpResponse = require('../helpers/http_response');
const statusCode = require('../helpers/status_code');

function notFound(req, res, next) {  
  return httpResponse.wrong(res, statusCode.error.NOT_FOUND, `The endpoint '${req.url}' doest not exist`)
}

function error(err, req, res, next) {
  return httpResponse.error(res, err, "Unexpected error");
}

module.exports = { notFound, error };