'use strict';

const { stub } = require('sinon');
const { expect } = require('chai');
const mw = require('../../../src/services/query-service-provider/src/setup-response-mw');

describe('query-provider-service setup-mw unit tests', () => {
  it('should create an empty res.provider object', () => {
    const res = {};
    const next = stub();

    mw({}, res, next);
    expect(res.provider).to.deep.equal({});
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
  });
});
