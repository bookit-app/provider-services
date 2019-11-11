'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone } = require('lodash');

/**
 * Express Middleware to trigger the creation of the
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
    const request = {
      providerId: res.provider.providerId,
      businessName: res.provider.businessName,
      requestorUid: req.apiUserInfo.id,
      requestedStaffMemberEmail: req.body.requestedStaffMemberEmail
    };

    const docId = await repository.create(request);
    res.location(`/staffMemberRequest/${docId}`);
    next();
  } catch (err) {
    const error = clone(errors.updateFailed);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
