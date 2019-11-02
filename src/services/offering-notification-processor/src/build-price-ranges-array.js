'use strict';

const { priceRangeCheck } = require('../../../lib/util/service-offering-util');

/**
 * Express Middleware to to trigger the provider query request
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = (req, res, next) => {
  res.serviceOfferingPriceRanges = Object.keys(
    res.services.reduce((ranges, service) => {
      ranges[priceRangeCheck(service.price)] = true;
      return ranges;
    }, {})
  );

  next();
};
