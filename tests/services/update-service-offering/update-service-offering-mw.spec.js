'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  update: stub()
};
const mw = require('../../../src/services/update-service-offering/src/update-service-offering-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-USER'
  },
  params: {
    providerId: 'TEST-PROVIDER',
    serviceId: 'TEST-OFFERING'
  },
  body: {
    description: 'We give the best fade with super highly trained staff.',
    price: 15.0,
    currency: 'USD'
  }
};

const res = {};

const next = stub();

describe('update-service-offering service unit-tests', () => {
  afterEach(() => {
    next.resetHistory();
    repoStub.update.resetHistory();
  });

  it('should trigger the update of the service', () => {
    repoStub.update.resolves('DOC-ID');
    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(
        repoStub.update.calledWith('TEST-PROVIDER', 'TEST-OFFERING', {
          description: 'We give the best fade with super highly trained staff.',
          price: 15.0,
          currency: 'USD'
        })
      ).to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.update.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(
        repoStub.update.calledWith('TEST-PROVIDER', 'TEST-OFFERING', {
          description: 'We give the best fade with super highly trained staff.',
          price: 15.0,
          currency: 'USD'
        })
      ).to.be.true;
      expect(next.called).to.be.true;

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.updateFailed.errorCode);
      expect(statusCode).to.equal(errors.updateFailed.statusCode);
    });
  });
});
