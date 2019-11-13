'use strict';

const statusCode = require('http-status-codes');

module.exports = Object.freeze({
  statusCodes: statusCode,
  errors: {
    notFound: {
      errorCode: 'NOT_FOUND',
      statusCode: statusCode.NOT_FOUND,
      message: 'Object not found'
    },
    forbidden: {
      errorCode: 'FORBIDDEN',
      statusCode: statusCode.FORBIDDEN,
      message: 'You are not allowed to perform this action'
    },
    unauthorized: {
      errorCode: 'UNAUTHORIZED',
      statusCode: statusCode.UNAUTHORIZED,
      message: 'Authentication is required to access this endpoint'
    },
    malformedRequest: {
      errorCode: 'MALFORMED_REQUEST',
      statusCode: statusCode.BAD_REQUEST,
      message: 'Request is incorrect'
    },
    updateFailed: {
      errorCode: 'UPDATE_FAILED',
      statusCode: statusCode.BAD_REQUEST,
      message: 'Failed to save information'
    },
    systemError: {
      errorCode: 'INTERNAL_ERROR',
      statusCode: statusCode.INTERNAL_SERVER_ERROR,
      message: 'Well something went wrong...'
    }
  }
});
