'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone } = require('lodash');

/**
 * Express Middleware to trigger the creation of the
 * service in association the the provider. It assumes the data is pre-validated
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = repository => async (req, res, next) => {
  try {
    const service = req.body;
    const provider = req.params.providerId;
    const docId = await repository.createServiceForProvider(provider, service);
    res.location(`/provider/${provider}/service/${docId}`);
    next();
  } catch (err) {
    const error = clone(errors.updateFailed);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
