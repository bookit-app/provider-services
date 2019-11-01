'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// These will be lazily loaded when needed.
// Per Cloud Run best practice we should lazily load
// references https://cloud.google.com/run/docs/tips
let providerRepo, offeringRepo, updateProviderMW, queryOfferingsMW;

function updateProviderHandlerMW(req, res, next) {
  providerRepo =
    providerRepo ||
    require('../../../lib/repository/service-provider-repository')
      .serviceProviderRepositoryInstance;
  updateProviderMW =
    updateProviderMW || require('./update-service-provider-mw')(providerRepo);
  return updateProviderMW(req, res, next);
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
// Setup Express Server
const app = express();
app.use(bodyParser.json());

// Generate Route with necessary middleware
app.post(
  '/',
  require('../../../lib/mw/trace-id-mw'),
  //require('../../../lib/mw/convert-pubsub-message-mw'),
  queryOfferingsHandlerMW,
  require('./build-service-listing-array'),
  require('./build-price-ranges-array'),
  updateProviderHandlerMW,
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
