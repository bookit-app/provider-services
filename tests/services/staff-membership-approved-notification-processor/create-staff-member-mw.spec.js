'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  create: stub()
};
const mw = require('../../../src/services/staff-membership-accepted-notification-processor/src/create-staff-member-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-USER'
  },
  body: {
    providerId: 'TEST-PROVIDER-ID',
    staffMemberUid: 'TEST-MEMBER-UID'
  }
};

const res = {
  staffMemberProfile: {
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
  }
};

const next = stub();

describe('staff-membership-accepted-notification-processor create-staff-member-mw unit-tests', () => {
  afterEach(() => {
    next.resetHistory();
    repoStub.create.resetHistory();
  });

  it('should trigger the creation of the staff member', () => {
    repoStub.create.resolves('TEST-MEMBER-UID');
    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.create.called).to.be.true;
      expect(
        repoStub.create.calledWith('TEST-PROVIDER-ID', {
          staffMemberUid: 'TEST-MEMBER-UID',
          email: 'test@test.com',
          name: 'test-first-name test-last-name'
        })
      ).to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.create.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.create.called).to.be.true;
      expect(
        repoStub.create.calledWith('TEST-PROVIDER-ID', {
          staffMemberUid: 'TEST-MEMBER-UID',
          email: 'test@test.com',
          name: 'test-first-name test-last-name'
        })
      ).to.be.true;
      expect(next.called).to.be.true;

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.updateFailed.errorCode);
      expect(statusCode).to.equal(errors.updateFailed.statusCode);
    });
  });
});
