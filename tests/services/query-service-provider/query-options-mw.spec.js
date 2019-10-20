'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const mw = require('../../../src/services/query-service-provider/src/query-options-mw');

describe('query-service-provider query-options-mw unit tests', () => {
  it('should set the req.providerQueryOptions', () => {
    const next = stub();
    const req = {
      query: {
        select: 'test'
      }
    };
    mw(req, {}, next);
    expect(req.providerQueryOptions).to.deep.equal({
      select: 'test'
    });
  });

  it('should set the req.providerQueryOptions with lowercase', () => {
    const next = stub();
    const req = {
      query: {
        select: 'TEST'
      }
    };
    mw(req, {}, next);
    expect(req.providerQueryOptions).to.deep.equal({
      select: 'test'
    });
  });

  it('should not set any req.providerQueryOptions', () => {
    const next = stub();
    const req = {};
    mw(req, {}, next);
    expect(req.providerQueryOptions).to.equal();
  });
});
