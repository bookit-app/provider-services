'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone, isEmpty } = require('lodash');

/**
 * Express Middleware to verify if the staff member
 * is already associated with the service provider
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = repository => async (req, res, next) => {
  try {
    const staff = await repository.findByProviderIdAndEmail(
      res.provider.providerId,
      req.body.requestedStaffMemberEmail
    );

    if (!isEmpty(staff)) {
      const error = clone(errors.malformedRequest);
      error.message =
        'Provider already has a staff member with the provided email';
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
