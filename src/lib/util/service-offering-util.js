'use strict';

module.exports.priceRangeCheck = value => {
  if (value <= 5) return '$';
  else if (value > 5 && value <= 15) return '$$';
  else if (value > 15 && value <= 30) return '$$$';
  else return '$$$$';
};

module.exports.searchRelevantPriceRanges = requested => {
  const ranges = [];

  for (let range = '', a = 0, len = requested.length; a < len; a++) {
    range = `${range}$`;
    ranges.push(range);
  }

  return ranges;
};
