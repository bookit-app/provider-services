'use strict';

const { isEmpty } = require('lodash');

module.exports.priceRangeCheck = value => {
  if (value <= 5) return '$';
  else if (value > 5 && value <= 25) return '$$';
  else if (value > 25 && value <= 50) return '$$$';
  else return '$$$$';
};

module.exports.priceRangeSearchExpansionFunction = value => {
  const ranges = [];

  if (!isEmpty(value)) {
    for (let range = '', a = 0, len = value.length; a < len; a++) {
      range = `${range}$`;
      ranges.push(range);
    }
  }

  return ranges;
};

module.exports.defaultSearchExpansionFunction = value => value;
