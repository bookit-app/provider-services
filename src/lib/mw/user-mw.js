'use strict';

const { isEmpty } = require('lodash');
const { UNAUTHORIZED } = require('../constants').statusCodes;

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
    res.status(UNAUTHORIZED);
    next(new Error('User info not found'));
    return;
  }

  req.apiUserInfo = JSON.parse(
    Buffer.from(endpointApiUserInfo, 'base64').toString()
  );

  next();
};
