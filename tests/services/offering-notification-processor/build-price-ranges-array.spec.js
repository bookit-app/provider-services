'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const {
  priceRangeCheck
} = require('../../../src/lib/util/provider-search-util');
const mw = require('../../../src/services/offering-notification-processor/src/build-price-range-arrays');

describe('offering-notification-processor build-price-ranges-array unit tests', () => {
  context('validations for serviceOfferingPriceRanges', () => {
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
            price: 25.0
          },
          {
            styleId: 'CUSTOM',
            description: 'Beard Trim',
            currency: 'USD',
            price: 400.99
          }
        ]
      };

      const next = stub();

      mw({}, res, next);

      expect(next.called).to.be.true;
      expect(res.serviceOfferingPriceRanges).to.contain(priceRangeCheck(0.01));
      expect(res.serviceOfferingPriceRanges).to.contain(priceRangeCheck(25));
      expect(res.serviceOfferingPriceRanges).to.contain(
        priceRangeCheck(400.99)
      );
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

  context('validations for serviceOfferingSpecificPriceRanges', () => {
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
            price: 25.0
          },
          {
            styleId: 'CUSTOM',
            description: 'Beard Trim',
            currency: 'USD',
            price: 400.99
          }
        ]
      };

      const next = stub();

      mw({}, res, next);

      expect(next.called).to.be.true;
      expect(res.serviceOfferingSpecificPriceRanges.FADE).to.exist;
      expect(res.serviceOfferingSpecificPriceRanges.FADE).to.contain(
        priceRangeCheck(0.01)
      );
      expect(res.serviceOfferingSpecificPriceRanges.CUSTOM).to.exist;
      expect(res.serviceOfferingSpecificPriceRanges.CUSTOM).to.contain(
        priceRangeCheck(25)
      );
      expect(res.serviceOfferingSpecificPriceRanges.CUSTOM).to.contain(
        priceRangeCheck(400.99)
      );
    });

    it('should put an empty array when there is nothing valid', () => {
      const res = {
        services: []
      };

      const next = stub();

      mw({}, res, next);

      expect(next.called).to.be.true;
      expect(res.serviceOfferingSpecificPriceRanges).to.deep.equal({});
    });
  });
});
