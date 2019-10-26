'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');

const mw = require('../../../src/services/offering-notification-processor/src/build-service-listing-array');

describe('offering-notification-processor build-service-listing-array unit tests', () => {
  it('should populate an array with unique entries', () => {
    const res = {
      services: [
        {
          currency: 'USD',
          price: 40.58,
          styleId: 'FADE',
          description: 'Beard Trim'
        },
        {
          styleId: 'CUSTOM',
          description: 'Beard Trim',
          currency: 'USD',
          price: 40.58
        },
        {
          currency: 'USD',
          price: 40.58,
          styleId: 'FADE',
          description: 'Beard Trim'
        },
        {
          styleId: 'CUSTOM',
          description: 'Beard Trim',
          currency: 'USD',
          price: 40.58
        }
      ]
    };

    const next = stub();

    mw({}, res, next);

    expect(next.called).to.be.true;
    expect(res.serviceOfferingStyles.length).to.equal(2);
    expect(res.serviceOfferingStyles).to.contain('FADE');
    expect(res.serviceOfferingStyles).to.contain('CUSTOM');
  });
});
