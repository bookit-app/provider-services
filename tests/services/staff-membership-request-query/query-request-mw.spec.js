'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  findByRequestedEmail: stub()
};
const mw = require('../../../src/services/staff-membership-request-query/src/query-request-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-OWNERID',
    email: 'test@test.com'
  }
};

const requests = [
  {
    providerId: 'TEST-PROVIDER',
    businessName: 'TEST-BUSINESS-NAME',
    requestorUid: 'TEST-REQUESTOR',
    requestedStaffMemberEmail: 'test@test.com'
  }
];

const next = stub();

describe('staff-membership-request-query query-request-mw unit tests', () => {
  afterEach(() => {
    next.resetHistory();
    repoStub.findByRequestedEmail.resetHistory();
  });

  it('should add membershipRequests to res and call next', async () => {
    const res = {};
    repoStub.findByRequestedEmail.resolves(requests);
    await mw(req, res, next);
    expect(repoStub.findByRequestedEmail.calledWith('test@test.com')).to.be
      .true;
    expect(res.membershipRequests).to.deep.equal(requests);
    expect(next.called).to.be.true;
  });

  it('should raise UPDATE-FAILED if failure occurs from repo', async () => {
    repoStub.findByRequestedEmail.rejects(new Error('FORCED-ERROR'));
    await mw(req, {}, next);
    expect(repoStub.findByRequestedEmail.calledWith('test@test.com')).to.be
      .true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
