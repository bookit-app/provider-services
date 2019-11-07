'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const mw = require('../../../src/services/staff-membership-request-update/src/status-check-validation-mw');

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

  it('should call next if status is NEW', () => {
    const res = {
      membershipRequest: {
        status: 'NEW'
      }
    };

    mw(req, res, next);
    expect(next.called).to.be.true;
    expect(next.calledWith()).to.be.true;
  });

  it('should call next with error is any status other than NEW', () => {
    const res = {
      membershipRequest: {
        status: 'ACCEPTED'
      }
    };

    mw(req, res, next);
    expect(next.called).to.be.true;
    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.malformedRequest.errorCode);
    expect(statusCode).to.equal(errors.malformedRequest.statusCode);
  });
});
