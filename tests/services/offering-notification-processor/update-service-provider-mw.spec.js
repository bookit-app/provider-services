'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  update: stub()
};
const mw = require('../../../src/services/offering-notification-processor/src/update-service-provider-mw')(
  repoStub
);

const req = {
  body: {
    providerId: 'TEST'
  }
};

const res = {
  serviceOfferingStyles: ['FADE', 'CUSTOM']
};

const next = stub();

describe('offering-notification-processor update-service-provider-mw unit-tests', () => {
  afterEach(() => {
    next.resetHistory();
    repoStub.update.resetHistory();
  });

  it('should trigger the update of the provider', () => {
    repoStub.update.resolves();
    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(
        repoStub.update.calledWith('TEST', {
          styles: res.serviceOfferingStyles
        })
      ).to.be.true;
      expect(next.called).to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.update.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(
        repoStub.update.calledWith('TEST', {
          styles: res.serviceOfferingStyles
        })
      ).to.be.true;
      expect(next.called).to.be.true;

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.updateFailed.errorCode);
      expect(statusCode).to.equal(errors.updateFailed.statusCode);
    });
  });

  it('should call next with no error on failure from repo when code is PROVIDER_NOT_EXISTING', () => {
    const err = new Error();
    err.code = 'PROVIDER_NOT_EXISTING';
    repoStub.update.rejects(err);

    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.update.called).to.be.true;
      expect(
        repoStub.update.calledWith('TEST', {
          styles: res.serviceOfferingStyles
        })
      ).to.be.true;
      expect(next.called).to.be.true;
      expect(next.calledWith()).to.be.true;
    });
  });
});
