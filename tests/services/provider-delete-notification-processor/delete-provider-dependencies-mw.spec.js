'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  deleteAllForProvider: stub()
};
const mw = require('../../../src/services/provider-delete-notification-processor/src/delete-provider-dependencies-mw')(
  repoStub
);

const req = {
  body: {
    providerId: 'TEST'
  }
};

const next = stub();

describe('provider-delete-notification-processor delete-provider-dependencies-mw unit-tests', () => {
  afterEach(() => {
    next.resetHistory();
    repoStub.deleteAllForProvider.resetHistory();
  });

  it('should trigger the delete of the provider', () => {
    repoStub.deleteAllForProvider.resolves();
    expect(mw(req, {}, next)).to.be.fulfilled.then(() => {
      expect(repoStub.deleteAllForProvider.called).to.be.true;
      expect(repoStub.deleteAllForProvider.calledWith('TEST')).to.be.true;
      expect(next.called).to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.deleteAllForProvider.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, {}, next)).to.be.fulfilled.then(() => {
      expect(repoStub.deleteAllForProvider.called).to.be.true;
      expect(repoStub.deleteAllForProvider.calledWith('TEST')).to.be.true;
      expect(next.called).to.be.true;

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.updateFailed.errorCode);
      expect(statusCode).to.equal(errors.updateFailed.statusCode);
    });
  });
});
