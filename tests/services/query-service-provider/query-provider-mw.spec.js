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
  },
  providerQueryOptions: {}
};

const res = {
  provider: {}
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

describe('query-service-provider query-provider-mw unit tests', () => {
  afterEach(() => {
    res.provider = {};
    req.providerQueryOptions = {};
    next.resetHistory();
    repoStub.findByProviderId.resetHistory();
    repoStub.selectableMaps = [];
  });

  it('should populate the provider when found', async () => {
    repoStub.findByProviderId.resolves(provider);
    await mw(req, res, next);
    expect(repoStub.findByProviderId.calledWith('TEST-PROVIDER')).to.be.true;
    expect(res.provider).to.deep.equal(provider);
    expect(next.called).to.be.true;
  });

  it('should just call next when select option does not apply', async () => {
    req.providerQueryOptions.select = 'TEST';
    repoStub.selectableMaps = [];

    await mw(req, res, next);
    expect(repoStub.findByProviderId.called).to.be.false;
    expect(next.called).to.be.true;
  });

  it('should query when select option does apply', async () => {
    req.providerQueryOptions.select = 'TEST';
    repoStub.selectableMaps = ['TEST'];
    repoStub.findByProviderId.resolves(provider);

    await mw(req, res, next);
    expect(repoStub.findByProviderId.calledWith('TEST-PROVIDER')).to.be.true;
    expect(res.provider).to.deep.equal(provider);
    expect(next.called).to.be.true;
  });

  it('should call next with an error when repo query fails', async () => {
    repoStub.findByProviderId.rejects(new Error('FORCED-ERROR'));
    await mw(req, res, next);

    expect(repoStub.findByProviderId.calledWith('TEST-PROVIDER')).to.be.true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
