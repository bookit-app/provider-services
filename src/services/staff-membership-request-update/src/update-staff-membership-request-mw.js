'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone } = require('lodash');

/**
 * Express Middleware to trigger the update of the
 * staff membership request. It assumes the data is pre-validated
 * and the request object is containing the necessary user details
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = repository => async (req, res, next) => {
  try {
    await repository.update(req.params.id, {
      status: req.body.status,
      staffMemberUid: req.apiUserInfo.id
    });
    next();
  } catch (err) {
    const error = clone(errors.updateFailed);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
