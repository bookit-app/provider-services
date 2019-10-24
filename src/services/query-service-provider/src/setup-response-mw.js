'use strict';

/**
 * Express Middleware to create the response body
 * the rest of the MW chain depends on this to exist
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns
 */
module.exports = (req, res, next) => {
  res.provider = {};
  next();
};
