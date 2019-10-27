'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  delete: stub()
};
const mw = require('../../../src/services/delete-service-provider/src/delete-provider-mw')(
  repoStub
);

const req = {
  params: {
    providerId: 'TEST'
  }
};

const next = stub();

describe('delete-service-provider delete-provider-mw unit-tests', () => {
  afterEach(() => {
    next.resetHistory();
    repoStub.delete.resetHistory();
  });

  it('should trigger the delete of the provider', () => {
    repoStub.delete.resolves();
    expect(mw(req, {}, next)).to.be.fulfilled.then(() => {
      expect(repoStub.delete.called).to.be.true;
      expect(repoStub.delete.calledWith('TEST')).to.be.true;
      expect(next.called).to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.delete.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, {}, next)).to.be.fulfilled.then(() => {
      expect(repoStub.delete.called).to.be.true;
      expect(repoStub.delete.calledWith('TEST')).to.be.true;
      expect(next.called).to.be.true;

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.updateFailed.errorCode);
      expect(statusCode).to.equal(errors.updateFailed.statusCode);
    });
  });
});
