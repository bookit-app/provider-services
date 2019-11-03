'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  findByOwnerUid: stub()
};
const mw = require('../../../src/services/staff-membership-request/src/query-provider-mw')(
  repoStub
);

const req = {
  apiUserInfo: {
    id: 'TEST-OWNERID'
  }
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

describe('staff-membership-request query-provider-mw unit tests', () => {
  afterEach(() => {
    res.provider = {};
    next.resetHistory();
    repoStub.findByOwnerUid.resetHistory();
  });

  it('should populate the provider when found', async () => {
    repoStub.findByOwnerUid.resolves(provider);
    await mw(req, res, next);
    expect(repoStub.findByOwnerUid.calledWith('TEST-OWNERID')).to.be.true;
    expect(res.provider).to.deep.equal(provider);
    expect(next.called).to.be.true;
  });

  it('should raise MALFORMED-REQUEST error when provider is not found', async () => {
    repoStub.findByOwnerUid.resolves({});
    await mw(req, res, next);
    expect(repoStub.findByOwnerUid.calledWith('TEST-OWNERID')).to.be.true;
    expect(res.provider).to.deep.equal({});
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.malformedRequest.errorCode);
    expect(statusCode).to.equal(errors.malformedRequest.statusCode);
  });

  it('should call next with an error when repo query fails', async () => {
    repoStub.findByOwnerUid.rejects(new Error('FORCED-ERROR'));
    await mw(req, res, next);

    expect(repoStub.findByOwnerUid.calledWith('TEST-OWNERID')).to.be.true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
