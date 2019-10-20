'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  findByProviderId: stub()
};
const mw = require('../../../src/services/query-service-provider/src/query-provider-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-USER'
  },
  params: {
    providerId: 'TEST-PROVIDER'
  }
};

const sendStub = stub();
const res = {
  status: stub().returns({ send: sendStub }),
  sendStatus: sendStub
};

const provider = {
  businessName: 'Test Business',
  ownerUid: '057KyiBA50aXpjjeVXKdyIIkOmf1',
  ein: '43-2347647',
  address: {
    streetAddress: '1234 Home Street',
    zip: '98765',
    city: 'Palo Alto',
    state: 'CA'
  },
  phoneNumber: '123-123-1234',
  email: 'test@test.com'
};

const next = stub();

afterEach(() => {
  sendStub.resetHistory();
  res.status.resetHistory();
  next.resetHistory();
});

describe('query-service-provider query-provider-mw unit tests', () => {
  it('should respond with OK and the profile when found', async () => {
    repoStub.findByProviderId.resolves(provider);
    await mw(req, res, next);
    expect(repoStub.findByProviderId.calledWith('TEST-PROVIDER')).to.be.true;
    expect(sendStub.calledWith(provider));
    expect(res.status.calledWith(200));
    expect(next.called).to.be.false;
  });

  it('should respond with OK when the profile when found and provide options to repo', async () => {
    const reqWithOptions = {
      apiUserInfo: {
        id: 'TEST-USER'
      },
      params: {
        providerId: 'TEST-PROVIDER'
      },
      providerQueryOptions: {
        select: 'address'
      }
    };

    repoStub.findByProviderId.resolves({
      address: {
        streetAddress: '1234 Home Street',
        zip: '98765',
        city: 'Palo Alto',
        state: 'CA'
      }
    });

    await mw(reqWithOptions, res, next);
    expect(
      repoStub.findByProviderId.calledWith(
        'TEST-PROVIDER',
        reqWithOptions.providerQueryOptions
      )
    ).to.be.true;
    expect(sendStub.calledWith(provider));
    expect(res.status.calledWith(200));
    expect(next.called).to.be.false;
  });

  it('should respond with NOT_FOUND when no profile is found', async () => {
    repoStub.findByProviderId.resolves(undefined);
    await mw(req, res, next);
    expect(repoStub.findByProviderId.calledWith('TEST-PROVIDER')).to.be.true;
    expect(sendStub.calledWith(404));
    expect(next.called).to.be.false;
  });

  it('should call next with an error when repo query fails', async () => {
    repoStub.findByProviderId.rejects(new Error('FORCED-ERROR'));
    await mw(req, res, next);

    expect(repoStub.findByProviderId.calledWith('TEST-PROVIDER')).to.be.true;
    expect(sendStub.called).to.be.false;
    expect(res.status.called).to.be.false;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
