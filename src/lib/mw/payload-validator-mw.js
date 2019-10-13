'use strict';

const Ajv = require('ajv');
const ajv = new Ajv();
const { ErrorHandler } = require('../util/error-handler');
const { errors } = require('../constants');
const { clone } = require('lodash');

module.exports = schema => {
  const validateFunction = ajv.compile(schema);

  return (req, res, next) => {
    const body = req.body;

    if (validateFunction(body)) {
      next();
      return;
    }

    const error = clone(errors.malformedRequest);
    error.message = ajv.errorsText(validateFunction.errors, { separator: '|' });

    next(new ErrorHandler(error));
  };
};
