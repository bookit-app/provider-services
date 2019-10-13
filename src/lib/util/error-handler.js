'use strict';

function handleError(err, res) {
  const { errorCode, statusCode, message } = err;

  res.status(statusCode).json({
    errorCode,
    message
  });
}

class ErrorHandler extends Error {
  constructor(errorCode, statusCode, message) {
    super();
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = {
  ErrorHandler,
  handleError
};
