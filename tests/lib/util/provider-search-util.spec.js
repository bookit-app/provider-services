'use strict';

const { expect } = require('chai');
const {
  priceRangeCheck,
  priceRangeSearchExpansionFunction
} = require('../../../src/lib/util/provider-search-util');

describe('service-offering-util unit tests', () => {
  context('priceRangeSearchExpansionFunction', () => {
    it('should return all relevant price ranges', () => {
      const ranges = priceRangeSearchExpansionFunction('$$$$');
      expect(ranges).to.include('$');
      expect(ranges).to.include('$$');
      expect(ranges).to.include('$$$');
      expect(ranges).to.include('$$$$');
    });

    it('should return $, $$, $$$ price ranges', () => {
      const ranges = priceRangeSearchExpansionFunction('$$$');
      expect(ranges).to.include('$');
      expect(ranges).to.include('$$');
      expect(ranges).to.include('$$$');
      expect(ranges).to.not.include('$$$$');
    });

    it('should return $, $$ price ranges', () => {
      const ranges = priceRangeSearchExpansionFunction('$$');
      expect(ranges).to.include('$');
      expect(ranges).to.include('$$');
      expect(ranges).to.not.include('$$$');
      expect(ranges).to.not.include('$$$$');
    });

    it('should return $ price ranges', () => {
      const ranges = priceRangeSearchExpansionFunction('$');
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
      expect(priceRangeCheck(24.99)).to.equal('$$');
    });
    it('should return $$', () => {
      expect(priceRangeCheck(25.0)).to.equal('$$');
    });
    it('should return $$$', () => {
      expect(priceRangeCheck(25.01)).to.equal('$$$');
    });
    it('should return $$$', () => {
      expect(priceRangeCheck(49.99)).to.equal('$$$');
    });
    it('should return $$$', () => {
      expect(priceRangeCheck(50.0)).to.equal('$$$');
    });
    it('should return $$$$', () => {
      expect(priceRangeCheck(50.01)).to.equal('$$$$');
    });
    it('should return $$$$', () => {
      expect(priceRangeCheck(100.0)).to.equal('$$$$');
    });
  });
});
