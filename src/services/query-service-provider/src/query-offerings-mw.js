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
  try {
    if (
      isEmpty(req.providerQueryOptions) ||
      req.providerQueryOptions.select === repository.collection
    ) {
      res.provider[
        repository.collection
      ] = await repository.findAllServiceOfferings(req.params.providerId);
    }

    next();
  } catch (err) {
    const error = clone(errors.systemError);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
