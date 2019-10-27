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
    await repository.update(req.body.providerId, {
      styles: res.serviceOfferingStyles
    });

    next();
  } catch (err) {
    if (err.code === 'PROVIDER_NOT_EXISTING') {
      // Nothing to process so just allow the chain to complete
      next();
    }

    const error = clone(errors.updateFailed);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
