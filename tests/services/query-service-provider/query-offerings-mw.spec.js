'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  findAllServiceOfferings: stub(),
  collection: 'services'
};
const mw = require('../../../src/services/query-service-provider/src/query-offerings-mw')(
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

const services = [
  {
    currency: 'USD',
    isCustomServiceType: false,
    price: 40.58,
    styleId: 'FADE',
    description: 'Beard Trim'
  },
  {
    styleId: 'CUSTOM',
    description: 'Beard Trim',
    currency: 'USD',
    isCustomServiceType: true,
    price: 40.58
  }
];

const next = stub();

describe('query-service-provider query-offering-mw unit tests', () => {
  afterEach(() => {
    res.provider = {};
    req.providerQueryOptions = {};
    next.resetHistory();
    repoStub.findAllServiceOfferings.resetHistory();
  });

  it('should populate the provider when found', async () => {
    repoStub.findAllServiceOfferings.resolves(services);
    await mw(req, res, next);
    expect(repoStub.findAllServiceOfferings.calledWith('TEST-PROVIDER')).to.be
      .true;
    expect(res.provider.services).to.deep.equal(services);
    expect(next.called).to.be.true;
  });

  it('should just call next when select option does not apply', async () => {
    req.providerQueryOptions.select = 'TEST';

    await mw(req, res, next);
    expect(repoStub.findAllServiceOfferings.called).to.be.false;
    expect(next.called).to.be.true;
  });

  it('should query when select option does apply', async () => {
    req.providerQueryOptions.select = 'services';
    repoStub.findAllServiceOfferings.resolves(services);

    await mw(req, res, next);
    expect(repoStub.findAllServiceOfferings.calledWith('TEST-PROVIDER')).to.be
      .true;
    expect(res.provider.services).to.deep.equal(services);
    expect(next.called).to.be.true;
  });

  it('should call next with an error when repo query fails', async () => {
    repoStub.findAllServiceOfferings.rejects(new Error('FORCED-ERROR'));
    await mw(req, res, next);

    expect(repoStub.findAllServiceOfferings.calledWith('TEST-PROVIDER')).to.be
      .true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
