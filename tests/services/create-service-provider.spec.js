'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../src/lib/constants');
const repoStub = {
  create: stub()
};
const mw = require('../../src/services/create-service-provider/src/create-service-provider-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-USER'
  },
  body: {
    ein: '12-1234567'
  }
};

const res = {
  location: stub()
};

const next = stub();

describe('create-service-provider service unit-tests', () => {
  afterEach(() => {
    req.body.ownerUid = undefined;
    next.resetHistory();
    res.location.resetHistory();
    repoStub.create.resetHistory();
  });

  it('should trigger the creation of the provider', () => {
    repoStub.create.resolves('DOC-ID');
    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.create.called).to.be.true;
      expect(
        repoStub.create.calledWith({
          ein: '12-1234567',
          ownerUid: 'TEST-USER'
        })
      ).to.be.true;
      expect(res.location.calledWith('/provider/DOC-ID')).to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.create.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.create.called).to.be.true;
      expect(
        repoStub.create.calledWith({
          ein: '12-1234567',
          ownerUid: 'TEST-USER'
        })
      ).to.be.true;
      expect(res.location.called).to.be.false;
      expect(next.called).to.be.true;

      const { errorCode, statusCode } = next.args[0][0];
      expect(errorCode).to.equal(errors.updateFailed.errorCode);
      expect(statusCode).to.equal(errors.updateFailed.statusCode);
    });
  });
});
