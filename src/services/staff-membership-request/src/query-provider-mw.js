'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone, isEmpty } = require('lodash');

/**
 * Express Middleware to trigger the provider query request
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = repository => async (req, res, next) => {
  try {
    res.provider = await repository.findByOwnerUid(req.apiUserInfo.id);

    if (isEmpty(res.provider)) {
      const error = clone(errors.malformedRequest);
      error.message = 'Provider not found for user';
      next(new ServiceError(error));
      return;
    }

    next();
  } catch (err) {
    const error = clone(errors.systemError);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
