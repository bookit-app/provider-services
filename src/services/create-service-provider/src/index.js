'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {
  serviceProviderRepositoryInstance
} = require('../../../lib/repository/service-provider-repository');
const ajv = require('../../../lib/util/validator');
const {
  schema,
  enableDynamicValidationChecks
} = require('./payload-validations');
enableDynamicValidationChecks(ajv, serviceProviderRepositoryInstance);

// Setup Express Server
const app = express();
app.use(bodyParser.json());

// Generate Route with necessary middleware
app.post(
  '/provider',
  require('../../../lib/mw/user-mw'),
  require('../../../lib/mw/trace-id-mw'),
  require('../../../lib/mw/payload-validation-mw')(schema),
  require('./create-service-provider-mw')(serviceProviderRepositoryInstance),
  require('./success-mw')
);

app.use(require('../../../lib/mw/error-handling-mw'));

// Start up the server and listen on the provided port
app.listen(process.env.PORT, err => {
  if (err) {
    console.log(`Server failed to start due to ${err.message}`);
    return;
  }
  console.log(`Server is running on port ${process.env.PORT}`);
});
