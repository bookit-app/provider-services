'use strict';

const Ajv = require('ajv');

module.exports.getValidator = options => {
  return new Ajv(options);
};
