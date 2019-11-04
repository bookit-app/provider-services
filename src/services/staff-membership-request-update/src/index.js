'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// These will be lazily loaded when needed.
// Per Cloud Run best practice we should lazily load
// references https://cloud.google.com/run/docs/tips
let staffMembershipRequestRepo,
  updateRequestMW,
  loadRequestCheckMW,
  validationMW,
  schema;

function updateRequestHandlerMW(req, res, next) {
  staffMembershipRequestRepo =
    staffMembershipRequestRepo ||
    require('../../../lib/repository/staff-membership-request-repository')
      .staffMembershipRequestRepositoryInstance;
  updateRequestMW =
    updateRequestMW ||
    require('./update-staff-membership-request')(staffMembershipRequestRepo);
  return updateRequestMW(req, res, next);
}

function loadRequestHandlerMW(req, res, next) {
  staffMembershipRequestRepo =
    staffMembershipRequestRepo ||
    require('../../../lib/repository/staff-membership-request-repository')
      .staffMembershipRequestRepositoryInstance;
  loadRequestCheckMW =
    loadRequestCheckMW ||
    require('./load-request-mw')(staffMembershipRequestRepo);
  return loadRequestCheckMW(req, res, next);
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
app.patch(
  '/staffMembershipRequest/:id',
  require('../../../lib/mw/user-mw'),
  require('../../../lib/mw/trace-id-mw'),
  validateMW,
  loadRequestHandlerMW,
  require('./user-check-mw'),
  require('./status-check-validation'),
  updateRequestHandlerMW,
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
