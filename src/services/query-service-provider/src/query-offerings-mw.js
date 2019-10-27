'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone, isEmpty } = require('lodash');

/**
 * Express Middleware to to trigger the provider query request
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = repository => async (req, res, next) => {
  if (isEmpty(res.provider)) {
    next();
    return;
  }

  try {
    const services = await repository.findAllServiceOfferings(
      req.params.providerId
    );

    // eslint-disable-next-line require-atomic-updates
    res.provider[repository.collection] = services;

    next();
  } catch (err) {
    const error = clone(errors.systemError);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
