'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  findByProviderIdAndEmail: stub()
};
const mw = require('../../../src/services/staff-membership-request/src/query-existing-staff')(
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
  }
};

const staffMember = {
  staffMemberUid: 'TEST-UID',
  email: 'test@test.com',
  name: 'TEST-NAME'
};

const next = stub();

describe('staff-membership-request query-existing-staff unit tests', () => {
  afterEach(() => {
    next.resetHistory();
    repoStub.findByProviderIdAndEmail.resetHistory();
  });

  it('should call next when staff member is not found', async () => {
    repoStub.findByProviderIdAndEmail.resolves({});
    await mw(req, res, next);
    expect(
      repoStub.findByProviderIdAndEmail.calledWith(
        'TEST-PROVIDER',
        'test@test.com'
      )
    ).to.be.true;
    expect(next.called).to.be.true;
  });

  it('should raise MALFORMED-REQUEST error when staff is found', async () => {
    repoStub.findByProviderIdAndEmail.resolves(staffMember);
    await mw(req, res, next);
    expect(
      repoStub.findByProviderIdAndEmail.calledWith(
        'TEST-PROVIDER',
        'test@test.com'
      )
    ).to.be.true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.malformedRequest.errorCode);
    expect(statusCode).to.equal(errors.malformedRequest.statusCode);
  });

  it('should call next with an error when repo query fails', async () => {
    repoStub.findByProviderIdAndEmail.rejects(new Error('FORCED-ERROR'));
    await mw(req, res, next);

    expect(
      repoStub.findByProviderIdAndEmail.calledWith(
        'TEST-PROVIDER',
        'test@test.com'
      )
    ).to.be.true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
