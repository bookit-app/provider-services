'use strict';

const { UNAUTHORIZED, BAD_REQUEST } = require('../constants').statusCodes;

function handleError(err, res) {
  const { errorCode, statusCode, message } = err;

  res.status(statusCode).json({
    errorCode,
    message
  });
}

class ErrorHandler extends Error {
  constructor(error) {
    super();
    this.errorCode = error.errorCode;
    this.statusCode = error.statusCode;
    this.message = error.message;
  }
}

const errors = {
  unauthorized: {
    errorCode: 'UNAUTHORIZED',
    statusCode: UNAUTHORIZED,
    message: 'Authentication is required to access this endpoint'
  },
  malformedRequest: {
    errorCode: 'MALFORMED_REQUEST',
    statusCode: BAD_REQUEST,
    message: 'Request is incorrect'
  },
  updateFailed: {
    errorCode: 'UPDATE_FAILED',
    statusCode: BAD_REQUEST,
    message: 'Failed to save information'
  }
};

module.exports = {
  ErrorHandler,
  handleError,
  errors
};
