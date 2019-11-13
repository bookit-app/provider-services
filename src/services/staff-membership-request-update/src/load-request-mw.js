'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone, isEmpty } = require('lodash');

/**
 * Express Middleware to load the request
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = repository => async (req, res, next) => {
  try {
    res.membershipRequest = await repository.findById(req.params.id);

    if (isEmpty(res.membershipRequest)) {
      const error = clone(errors.notFound);
      error.message = `Staff Membership Request not found`;
      next(new ServiceError(error));
      return;
    }

    next();
  } catch (err) {
    const error = clone(errors.updateFailed);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
