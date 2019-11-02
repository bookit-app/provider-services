'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  create: stub()
};
const mw = require('../../../src/services/create-service-offering/src/create-service-offering-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-USER'
  },
  params: {
    providerId: 'TEST-PROVIDER'
  },
  body: {
    styleId: 'FADE',
    description: 'We give the best fade with super highly trained staff.',
    price: 15.0,
    currency: 'USD'
  }
};

const res = {
  location: stub()
};

const next = stub();

describe('create-service-offering service unit-tests', () => {
  afterEach(() => {
    next.resetHistory();
    res.location.resetHistory();
    repoStub.create.resetHistory();
  });

  it('should trigger the creation of the service', () => {
    repoStub.create.resolves('DOC-ID');
    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.create.called).to.be.true;
      expect(
        repoStub.create.calledWith('TEST-PROVIDER', {
          styleId: 'FADE',
          description: 'We give the best fade with super highly trained staff.',
          price: 15.0,
          currency: 'USD'
        })
      ).to.be.true;
      expect(res.location.calledWith('/provider/TEST-PROVIDER/services/DOC-ID'))
        .to.be.true;
    });
  });

  it('should call next with FORCED-ERROR error on failure from repo', () => {
    repoStub.create.rejects(new Error('FORCED-ERROR'));

    expect(mw(req, res, next)).to.be.fulfilled.then(() => {
      expect(repoStub.create.called).to.be.true;
      expect(
        repoStub.create.calledWith('TEST-PROVIDER', {
          styleId: 'FADE',
          description: 'We give the best fade with super highly trained staff.',
          price: 15.0,
          currency: 'USD'
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
