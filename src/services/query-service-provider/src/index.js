'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// These will be lazily loaded when needed.
// Per Cloud Run best practice we should lazily load
// references https://cloud.google.com/run/docs/tips
let providerRepo,
  offeringRepo,
  staffMemberRepo,
  queryStaffMW,
  queryProviderMW,
  queryOfferingsMW;

function queryProviderHandlerMW(req, res, next) {
  providerRepo =
    providerRepo ||
    require('../../../lib/repository/service-provider-repository')
      .serviceProviderRepositoryInstance;
  queryProviderMW =
    queryProviderMW || require('./query-provider-mw')(providerRepo);
  return queryProviderMW(req, res, next);
}

function queryOfferingsHandlerMW(req, res, next) {
  offeringRepo =
    offeringRepo ||
    require('../../../lib/repository/service-offering-repository')
      .serviceOfferingRepositoryInstance;
  queryOfferingsMW =
    queryOfferingsMW || require('./query-offerings-mw')(offeringRepo);
  return queryOfferingsMW(req, res, next);
}

function queryStaffHandlerMW(req, res, next) {
  staffMemberRepo =
    staffMemberRepo ||
    require('../../../lib/repository/staff-member-repository')
      .staffMemberRepositoryInstance;
  queryStaffMW =
    queryStaffMW || require('./query-staff-members-mw')(staffMemberRepo);
  return queryStaffMW(req, res, next);
}

// Setup Express Server
const app = express();
app.use(bodyParser.json());

// Generate Route with necessary middleware
app.get(
  '/provider/:providerId',
  require('../../../lib/mw/user-mw'),
  require('../../../lib/mw/trace-id-mw'),
  require('./setup-response-mw'),
  queryProviderHandlerMW,
  queryStaffHandlerMW,
  queryOfferingsHandlerMW,
  require('./success-mw')
);

app.get(
  '/admin/provider/:providerId',
  require('../../../lib/mw/trace-id-mw'),
  require('./setup-response-mw'),
  queryProviderHandlerMW,
  queryStaffHandlerMW,
  queryOfferingsHandlerMW,
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
