'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const mw = require('../../../src/services/staff-membership-request-update/src/user-check-mw');

const req = {
  apiUserInfo: {
    id: 'TEST-OWNERID',
    email: 'test@test.com'
  },
  params: {
    id: 'TEST-ID'
  }
};

const next = stub();

describe('staff-membership-request-update user-check-mw unit tests', () => {
  afterEach(() => {
    next.resetHistory();
  });

  it('should call next if staff member uid is the current user', () => {
    const res = {
      membershipRequest: {
        requestedStaffMemberUid: 'TEST-OWNERID',
        requestedStaffMemberEmail: '',
        requestorUid: ''
      }
    };

    mw(req, res, next);
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
  });

  it('should call next if requestedStaffMemberEmail is the current user', () => {
    const res = {
      membershipRequest: {
        requestedStaffMemberUid: '',
        requestedStaffMemberEmail: 'test@test.com',
        requestorUid: ''
      }
    };

    mw(req, res, next);
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
  });

  it('should call next if requestorUid is the current user', () => {
    const res = {
      membershipRequest: {
        requestedStaffMemberUid: '',
        requestedStaffMemberEmail: '',
        requestorUid: 'TEST-OWNERID'
      }
    };

    mw(req, res, next);
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
  });

  it('should call next with forbidden error', () => {
    const res = {
      membershipRequest: {
        requestedStaffMemberUid: '',
        requestedStaffMemberEmail: '',
        requestorUid: ''
      }
    };

    mw(req, res, next);
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.forbidden.errorCode);
    expect(statusCode).to.equal(errors.forbidden.statusCode);
  });
});
