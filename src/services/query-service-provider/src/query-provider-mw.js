'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone, isEmpty } = require('lodash');
const { OK, NOT_FOUND } = require('../../../lib/constants').statusCodes;

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
    const provider = await repository.findByProviderId(
      req.params.providerId,
      req.providerQueryOptions
    );

    isEmpty(provider)
      ? res.sendStatus(NOT_FOUND)
      : res.status(OK).send(provider);
  } catch (err) {
    const error = clone(errors.systemError);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
