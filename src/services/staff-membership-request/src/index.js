'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// These will be lazily loaded when needed.
// Per Cloud Run best practice we should lazily load
// references https://cloud.google.com/run/docs/tips
let staffMembershipRequestRepo,
  staffMemberRepo,
  providerRepo,
  createRequestMW,
  queryStaffMW,
  queryProviderMW,
  validationMW,
  schema;

function createRequestHandlerMW(req, res, next) {
  staffMembershipRequestRepo =
    staffMembershipRequestRepo ||
    require('../../../lib/repository/staff-membership-request-repository')
      .staffMembershipRequestRepositoryInstance;
  createRequestMW =
    createRequestMW ||
    require('./create-staff-membership-request')(staffMembershipRequestRepo);
  return createRequestMW(req, res, next);
}

function queryStaffHandlerMW(req, res, next) {
  staffMemberRepo =
    staffMemberRepo ||
    require('../../../lib/repository/staff-member-repository')
      .staffMemberRepositoryInstance;
  queryStaffMW =
    queryStaffMW || require('./query-existing-staff')(staffMemberRepo);
  return queryStaffMW(req, res, next);
}

function queryProviderHandlerMW(req, res, next) {
  providerRepo =
    providerRepo ||
    require('../../../lib/repository/service-provider-repository')
      .serviceProviderRepositoryInstance;
  queryProviderMW =
    queryProviderMW ||
    require('./query-provider-mw')(providerRepo);
  return queryProviderMW(req, res, next);
}

function validateMW(req, res, next) {
  schema = schema || require('./payload-validations').schema;
  validationMW =
    validationMW || require('../../../lib/mw/payload-validation-mw')(schema);

  return validationMW(req, res, next);
}

// Setup Express Server
const app = express();
app.use(bodyParser.json());

// Generate Route with necessary middleware
app.post(
  '/',
  require('../../../lib/mw/user-mw'),
  require('../../../lib/mw/trace-id-mw'),
  validateMW,
  queryProviderHandlerMW,
  queryStaffHandlerMW,
  createRequestHandlerMW,
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
