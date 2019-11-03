'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  create: stub()
};
const mw = require('../../../src/services/staff-membership-request/src/create-staff-membership-request')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-OWNERID'
  },
  body: {
    requestedStaffMemberEmail: 'test@test.com'
  }
};

const res = {
  provider: {
    providerId: 'TEST-PROVIDER'
  },
  location: stub()
};

const next = stub();

describe('staff-membership-request create-staff-membership-request unit tests', () => {
  afterEach(() => {
    next.resetHistory();
    res.location.resetHistory();
    repoStub.create.resetHistory();
  });

  it('should trigger the creation of the request', () => {
    repoStub.create.resolves('DOC-ID');
    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.create.called).to.be.true;
      expect(
        repoStub.create.calledWith({
          providerId: 'TEST-PROVIDER',
          requestorUid: 'TEST-OWNERID',
          requestedStaffMemberEmail: 'test@test.com'
        })
      ).to.be.true;
      expect(res.location.calledWith('/staffMemberRequest/DOC-ID')).to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.create.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.create.called).to.be.true;
      expect(
        repoStub.create.calledWith({
          providerId: 'TEST-PROVIDER',
          requestorUid: 'TEST-OWNERID',
          requestedStaffMemberEmail: 'test@test.com'
        })
      ).to.be.true;
      expect(res.location.called).to.be.false;
      expect(next.called).to.be.true;

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.updateFailed.errorCode);
      expect(statusCode).to.equal(errors.updateFailed.statusCode);
    });
  });
});
