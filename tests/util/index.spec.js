'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { extractTraceIdFromHeader } = require('../../src/lib/util');

const req = {
  header: stub().returns('8b35b3bd2c62f98bfce0796516b8fa45;o=1')
};
describe('util function unit-tests', () => {
  it('should return the trace id when provided', () => {
    expect(extractTraceIdFromHeader(req)).to.equal(
      '8b35b3bd2c62f98bfce0796516b8fa45;o=1'
    );
  });

  it('should return the nothing when trace id is not provided provided', () => {
    req.header.returns();
    expect(extractTraceIdFromHeader(req)).to.equal('');
  });
});
