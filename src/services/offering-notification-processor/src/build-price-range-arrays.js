'use strict';

const { priceRangeCheck } = require('../../../lib/util/provider-search-util');
const { isEmpty } = require('lodash');

/**
 * Express Middleware to to trigger the provider query request
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = (req, res, next) => {
  const ranges = res.services.reduce(
    (ranges, service) => {
      ranges.serviceOfferingPriceRanges[priceRangeCheck(service.price)] = true;

      if (isEmpty(ranges.serviceOfferingSpecificPriceRanges[service.styleId])) {
        ranges.serviceOfferingSpecificPriceRanges[service.styleId] = {};
      }

      ranges.serviceOfferingSpecificPriceRanges[service.styleId][
        priceRangeCheck(service.price)
      ] = true;
      return ranges;
    },
    {
      serviceOfferingPriceRanges: {},
      serviceOfferingSpecificPriceRanges: {}
    }
  );

  res.serviceOfferingPriceRanges = Object.keys(
    ranges.serviceOfferingPriceRanges
  );

  res.serviceOfferingSpecificPriceRanges = Object.keys(
    ranges.serviceOfferingSpecificPriceRanges
  ).reduce((converted, styleId) => {
    converted[styleId] = Object.keys(
      ranges.serviceOfferingSpecificPriceRanges[styleId]
    );
    return converted;
  }, {});

  next();
};
