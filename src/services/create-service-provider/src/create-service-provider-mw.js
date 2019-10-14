'use strict';

const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error');
const { clone } = require('../../../../node_modules/lodash');

/**
 * Express Middleware to trigger the creation of the
 * service provider. It assumes the data is pre-validated
 * and the request object is containing the necessary user details
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = repository => async (req, res, next) => {
  try {
    const provider = req.body;
    provider.ownerUid = req.apiUserInfo.id;
    const docId = await repository.create(req.body);
    res.location(`/provider/${docId}`);
    next();
  } catch (err) {
    const error = clone(errors.updateFailed);
    error.message = err.message;
    next(new ServiceError(error));
  }
};
