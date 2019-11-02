'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');

const mw = require('../../../src/services/offering-notification-processor/src/build-price-ranges-array');

describe('offering-notification-processor build-price-ranges-array unit tests', () => {
  it('should populate an array with unique entries', () => {
    const res = {
      services: [
        {
          currency: 'USD',
          price: 0.01,
          styleId: 'FADE',
          description: 'Beard Trim'
        },
        {
          styleId: 'CUSTOM',
          description: 'Beard Trim',
          currency: 'USD',
          price: 5.0
        },
        {
          styleId: 'CUSTOM',
          description: 'Beard Trim',
          currency: 'USD',
          price: 4.99
        },
        {
          styleId: 'CUSTOM',
          description: 'Beard Trim',
          currency: 'USD',
          price: 5.01
        },
        {
          styleId: 'CUSTOM',
          description: 'Beard Trim',
          currency: 'USD',
          price: 14.99
        },
        {
          styleId: 'CUSTOM',
          description: 'Beard Trim',
          currency: 'USD',
          price: 15.0
        },
        {
          styleId: 'CUSTOM',
          description: 'Beard Trim',
          currency: 'USD',
          price: 15.01
        },
        {
          currency: 'USD',
          price: 29.99,
          styleId: 'FADE',
          description: 'Beard Trim'
        },
        {
          styleId: 'CUSTOM',
          description: 'Beard Trim',
          currency: 'USD',
          price: 30
        },
        {
          styleId: 'CUSTOM',
          description: 'Beard Trim',
          currency: 'USD',
          price: 30.01
        }
      ]
    };

    const next = stub();

    mw({}, res, next);

    expect(next.called).to.be.true;
    expect(res.serviceOfferingPriceRanges.length).to.equal(4);
    expect(res.serviceOfferingPriceRanges).to.contain('$');
    expect(res.serviceOfferingPriceRanges).to.contain('$$');
    expect(res.serviceOfferingPriceRanges).to.contain('$$$');
    expect(res.serviceOfferingPriceRanges).to.contain('$$$$');
  });

  it('should put an empty array when there is nothing valid', () => {
    const res = {
      services: []
    };

    const next = stub();

    mw({}, res, next);

    expect(next.called).to.be.true;
    expect(res.serviceOfferingPriceRanges).to.deep.equal([]);
  });
});
