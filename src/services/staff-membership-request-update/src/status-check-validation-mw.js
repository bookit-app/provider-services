'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone } = require('lodash');

/**
 * Express Middleware to valid the request is in the proper status
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = (req, res, next) => {
  if (res.membershipRequest.status === 'NEW') {
    next();
  } else {
    const error = clone(errors.malformedRequest);
    error.message = `Request is in status ${res.membershipRequest.status} and cannot be changed`;
    next(new ServiceError(error));
  }
};
