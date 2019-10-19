'use strict';

const { clone, isEmpty } = require('../../../../node_modules/lodash');
const { errors } = require('../../../lib/constants');
const ServiceError = require('../../../lib/util/service-error.js');
const {
  supportedSearchParams
} = require('../../../lib/repository/service-provider-repository');

module.exports = (req, res, next) => {
  if (!isEmpty(req.query)) {
    req.searchOptions = supportedSearchParams.reduce(
      (options, supportedParam) => {
        const value = req.query[supportedParam];

        if (value) {
          options[supportedParam] = value;
        }

        return options;
      },
      {}
    );
  }

  if (isEmpty(req.searchOptions)) {
    const error = clone(errors.malformedRequest);
    error.message = 'No supported query parameters found in request';
    next(new ServiceError(error));
    return;
  }

  next();
};
