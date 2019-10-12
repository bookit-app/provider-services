'use strict';

const { isEmpty } = require('lodash');

module.exports.extractTraceIdFromHeader = req => {
  const traceHeader = req.header('X-Cloud-Trace-Context');

  if (isEmpty(traceHeader)) return '';

  const [trace] = traceHeader.split('/');
  return trace;
};
