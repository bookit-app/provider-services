'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const mw = require('../../../src/services//provider-search/src/search-options-mw');

describe('provider-search search-options-mw unit tests', () => {
  it('should populate the req.searchOptions when valid options are provided', () => {
    const req = {
      query: {
        zip: '12345',
        state: 'NY'
      }
    };

    const next = stub();

    mw(req, {}, next);
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
    expect(req.searchOptions.zip).to.equal('12345');
    expect(req.searchOptions.state).to.equal('NY');
  });

  it('should ignore invalid search options', () => {
    const req = {
      query: {
        zip: '12345',
        state: 'NY',
        skip: 'TO BE SKIPPED'
      }
    };

    const next = stub();

    mw(req, {}, next);
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
    expect(req.searchOptions.zip).to.equal('12345');
    expect(req.searchOptions.state).to.equal('NY');
    expect(req.searchOptions.skip).to.equal(undefined);
  });

  it('should raise malformed request when no search parameters are valid', () => {
    const req = {
      query: {}
    };

    const next = stub();

    mw(req, {}, next);
    expect(next.called).to.be.true;
    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.malformedRequest.errorCode);
    expect(statusCode).to.equal(errors.malformedRequest.statusCode);
  });
});
