'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  findById: stub()
};
const mw = require('../../../src/services/staff-membership-request-update/src/load-request-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-OWNERID'
  },
  params: {
    id: 'TEST-ID'
  }
};

const next = stub();

describe('staff-membership-request-update load-request-mw unit tests', () => {
  afterEach(() => {
    next.resetHistory();
    repoStub.findById.resetHistory();
  });

  it('should add membershipRequest to res and call next', async () => {
    const membership = {
      id: 'MEMBERSHIP'
    };

    const res = {};
    repoStub.findById.resolves(membership);
    await mw(req, res, next);
    expect(repoStub.findById.calledWith('TEST-ID')).to.be.true;
    expect(res.membershipRequest).to.deep.equal(membership);
    expect(next.called).to.be.true;
  });

  it('should raise NOT-FOUND', async () => {
    repoStub.findById.resolves({});
    await mw(req, {}, next);
    expect(repoStub.findById.calledWith('TEST-ID')).to.be.true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.notFound.errorCode);
    expect(statusCode).to.equal(errors.notFound.statusCode);
  });

  it('should raise UPDATE-FAILED if failure occurs from repo', async () => {
    repoStub.findById.rejects(new Error('FORCED-ERROR'));
    await mw(req, {}, next);
    expect(repoStub.findById.calledWith('TEST-ID')).to.be.true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.updateFailed.errorCode);
    expect(statusCode).to.equal(errors.updateFailed.statusCode);
  });
});
