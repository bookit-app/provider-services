'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const firestore = require('../../../lib/repository/firestore');
const ServiceProviderRepository = require('../../../lib/repository/service-provider-repository');
const createServiceProviderFactory = require('./create-service-provider-mw');
//const logger = require('../../../lib/util/logger');
const extractUserMW = require('../../../lib/mw/user-mw');
const extractTraceContextMW = require('../../../lib/mw/trace-id-mw');
const payloadValidator = require('../../../lib/mw/payload-validator-mw');
const { handleError } = require('../../../lib/util/error-handler');
const schema = require('./payload-schema');
const createServiceProviderMW = createServiceProviderFactory(
  new ServiceProviderRepository(firestore)
);
const payloadValidatorMW = payloadValidator(schema);
const successMW = require('./success-mw');

// Setup Express Server
const app = express();
app.use(bodyParser.json());

// Generate Route with necessary middleware
app.post(
  '/provider',
  extractUserMW,
  extractTraceContextMW,
  payloadValidatorMW,
  createServiceProviderMW,
  successMW
);

app.use((err, req, res, next) => {
  handleError(err, res, next);
});

// Start up the server and listen on the provided port
app.listen(process.env.PORT, err => {
  if (err) {
    console.log(`Server failed to start due to ${err.message}`);
    return;
  }

  console.log(`Server is running on port ${process.env.PORT}`);
});
