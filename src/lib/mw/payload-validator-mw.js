'use strict';

const Ajv = require('ajv');
const ajv = new Ajv();
const { ErrorHandler } = require('../util/error-handler');

module.exports = schema => {
  const validateFunction = ajv.compile(schema);

  return (req, res, next) => {
    const body = req.body;

    if (validateFunction(body)) {
      next();
      return;
    }

    next(
      new ErrorHandler(
        'MALFORMED_REQUEST',
        400,
        ajv.errorsText(validateFunction.errors, { separator: '|' })
      )
    );
  };
};
