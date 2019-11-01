'use strict';

const { expect } = require('chai');
const {
  priceRangeCheck,
  searchRelevantPriceRanges
} = require('../../../src/lib/util/service-offering-util');

describe('service-offering-util unit tests', () => {
  context('searchRelevantPriceRanges', () => {
    it('should return all relevant price ranges', () => {
      const ranges = searchRelevantPriceRanges('$$$$');
      expect(ranges).to.include('$');
      expect(ranges).to.include('$$');
      expect(ranges).to.include('$$$');
      expect(ranges).to.include('$$$$');
    });

    it('should return $, $$, $$$ price ranges', () => {
      const ranges = searchRelevantPriceRanges('$$$');
      expect(ranges).to.include('$');
      expect(ranges).to.include('$$');
      expect(ranges).to.include('$$$');
      expect(ranges).to.not.include('$$$$');
    });

    it('should return $, $$ price ranges', () => {
      const ranges = searchRelevantPriceRanges('$$');
      expect(ranges).to.include('$');
      expect(ranges).to.include('$$');
      expect(ranges).to.not.include('$$$');
      expect(ranges).to.not.include('$$$$');
    });

    it('should return $ price ranges', () => {
      const ranges = searchRelevantPriceRanges('$');
      expect(ranges).to.include('$');
      expect(ranges).to.not.include('$$');
      expect(ranges).to.not.include('$$$');
      expect(ranges).to.not.include('$$$$');
    });
  });

  context('priceRangeCheck', () => {
    it('should return $', () => {
      expect(priceRangeCheck(0.01)).to.equal('$');
    });
    it('should return $', () => {
      expect(priceRangeCheck(4.99)).to.equal('$');
    });
    it('should return $', () => {
      expect(priceRangeCheck(5.0)).to.equal('$');
    });
    it('should return $$', () => {
      expect(priceRangeCheck(5.01)).to.equal('$$');
    });
    it('should return $$', () => {
      expect(priceRangeCheck(14.99)).to.equal('$$');
    });
    it('should return $$', () => {
      expect(priceRangeCheck(15.0)).to.equal('$$');
    });
    it('should return $$$', () => {
      expect(priceRangeCheck(15.01)).to.equal('$$$');
    });
    it('should return $$$', () => {
      expect(priceRangeCheck(29.99)).to.equal('$$$');
    });
    it('should return $$$', () => {
      expect(priceRangeCheck(30.0)).to.equal('$$$');
    });
    it('should return $$$$', () => {
      expect(priceRangeCheck(30.01)).to.equal('$$$$');
    });
    it('should return $$$$', () => {
      expect(priceRangeCheck(50.0)).to.equal('$$$$');
    });
  });
});
