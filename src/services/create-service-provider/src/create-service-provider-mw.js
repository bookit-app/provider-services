'use strict';

const { errors, ErrorHandler } = require('../../../lib/util/error-handler');
const { clone } = require('../../../../node_modules/lodash');

module.exports = repository => async (req, res, next) => {
  const provider = req.body;
  try {
    await repository.create(provider);
    next();
  } catch (err) {
    if (err.code === 6) {
      const error = clone(errors.updateFailed);
      error.message = 'Service Provider with ein already exists';

      next(new ErrorHandler(error));
    }
  }
};
