'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone } = require('lodash');

/**
 * Express Middleware to verify the user performing the update
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = (req, res, next) => {
  if (
    res.membershipRequest.requestedStaffMemberUid === req.apiUserInfo.id ||
    res.membershipRequest.requestedStaffMemberEmail === req.apiUserInfo.email
  ) {
    next();
  } else {
    const error = clone(errors.forbidden);
    next(new ServiceError(error));
  }
};
