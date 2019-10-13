'use strict';

const { isEmpty } = require('lodash');
const { ErrorHandler } = require('../util/error-handler');
const { errors } = require('../constants');

/**
 * Extracts the user information which was populated
 * by the ESP for Cloud Endpoints
 *
 * @param {Express.Request} req
 * @returns
 */
module.exports = (req, res, next) => {
  const endpointApiUserInfo = req.header('X-Endpoint-API-UserInfo');

  if (isEmpty(endpointApiUserInfo)) {
    next(new ErrorHandler(errors.unauthorized));
    return;
  }

  req.apiUserInfo = JSON.parse(
    Buffer.from(endpointApiUserInfo, 'base64').toString()
  );

  next();
};
