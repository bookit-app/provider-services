'use strict';

const { CREATED } = require('../../../lib/constants').statusCodes;

module.exports = (req, res) => {
  // TODO: Set Location header
  res.sendStatus(CREATED);
};
