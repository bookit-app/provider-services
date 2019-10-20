'use strict';

const { isEmpty } = require('lodash');

module.exports = (req, res, next) => {
  if (!(isEmpty(req.query) || isEmpty(req.query))) {
    req.providerQueryOptions = {
      select: req.query.select.toLowerCase()
    };
  }

  next();
};
