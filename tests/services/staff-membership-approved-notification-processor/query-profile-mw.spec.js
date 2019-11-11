'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const clientStub = {
  queryProfile: stub()
};
const mw = require('../../../src/services/staff-membership-accepted-notification-processor/src/query-profile-mw')(
  clientStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-OWNERID',
    email: 'test@test.com'
  },
  body: {
    staffMemberUid: 'TEST-MEMBER-UID'
  }
};

const profile = {
  address: {
    city: 'city',
    state: 'NY',
    streetAddress: 'a street somewhere',
    zip: 12345
  },
  birthday: '11-13-2019',
  email: 'test@test.com',
  firstName: 'test-first-name',
  gender: 'M',
  isProvider: false,
  lastName: 'test-last-name',
  phoneNumber: '123-123-1234'
};

const next = stub();

describe('staff-membership-accepted-notification-processor query-profile-mw unit tests', () => {
  afterEach(() => {
    next.resetHistory();
    clientStub.queryProfile.resetHistory();
  });

  it('should retrieve the profile from the profile-query client', async () => {
    const res = {};
    clientStub.queryProfile.resolves(profile);
    await mw(req, res, next);
    expect(clientStub.queryProfile.calledWith('TEST-MEMBER-UID')).to.be.true;
    expect(res.staffMemberProfile).to.deep.equal(profile);
    expect(next.called).to.be.true;
  });

  it('should raise UPDATE-FAILED if failure occurs from repo', async () => {
    clientStub.queryProfile.rejects(new Error('FORCED-ERROR'));
    await mw(req, {}, next);
    expect(clientStub.queryProfile.calledWith('TEST-MEMBER-UID')).to.be.true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.updateFailed.errorCode);
    expect(statusCode).to.equal(errors.updateFailed.statusCode);
  });
});
