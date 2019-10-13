'use strict';

const { ErrorHandler } = require('../../../lib/util/error-handler');
const { BAD_REQUEST } = require('../../../lib/constants').statusCodes;

module.exports = repository => async (req, res, next) => {
  const provider = req.body;
  try {
    await repository.create(provider);
    next();
  } catch (err) {
    if (err.code === 6) {
      next(
        new ErrorHandler(
          'SAVE_FAILED',
          BAD_REQUEST,
          'Service Provider with ein already exists'
        )
      );
    }
  }
};
