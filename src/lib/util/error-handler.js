'use strict';

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

module.exports = {
  ErrorHandler,
  handleError
};
