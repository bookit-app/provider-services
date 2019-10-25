'use strict';

const { uniqBy } = require('lodash');

/**
 * Express Middleware to to trigger the provider query request
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = (req, res, next) => {
  res.serviceOfferingStyles = uniqBy(
    res.services,
    service => service.styleId
  ).map(service => service.styleId);

  next();
};
