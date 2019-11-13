'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  update: stub()
};
const mw = require('../../../src/services/staff-membership-request-update/src/update-staff-membership-request-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-OWNERID'
  },
  params: {
    id: 'TEST-ID'
  },
  body: {
    status: 'APPROVED'
  }
};

const next = stub();

describe('staff-membership-request-update update-staff-membership-request-mw unit tests', () => {
  afterEach(() => {
    next.resetHistory();
    repoStub.update.resetHistory();
  });

  it('should trigger the update', async () => {
    repoStub.update.resolves();
    await mw(req, {}, next);
    expect(
      repoStub.update.calledWith('TEST-ID', {
        status: 'APPROVED',
        staffMemberUid: 'TEST-OWNERID'
      })
    ).to.be.true;
    expect(next.called).to.be.true;
  });

  it('should raise UPDATE-FAILED if failure occurs from repo', async () => {
    repoStub.update.rejects(new Error('FORCED-ERROR'));
    await mw(req, {}, next);
    expect(
      repoStub.update.calledWith('TEST-ID', {
        status: 'APPROVED',
        staffMemberUid: 'TEST-OWNERID'
      })
    ).to.be.true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.updateFailed.errorCode);
    expect(statusCode).to.equal(errors.updateFailed.statusCode);
  });
});
