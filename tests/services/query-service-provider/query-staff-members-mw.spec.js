'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const repoStub = {
  findAllStaffMembers: stub(),
  collection: 'staff'
};
const mw = require('../../../src/services/query-service-provider/src/query-staff-members-mw')(
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

const res = {
  provider: {}
};

const staff = [
  {
    staffMemberUid: 'TEST-UID',
    email: 'test@test.com',
    name: 'TEST-NAME'
  },
  {
    staffMemberUid: 'TEST-UID-1',
    email: 'test1@test.com',
    name: 'TEST1-NAME'
  }
];

const next = stub();

describe('query-service-provider query-staff-members-mw unit tests', () => {
  afterEach(() => {
    res.provider = {
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
    next.resetHistory();
    repoStub.findAllStaffMembers.resetHistory();
  });

  it('should call next if the res.provider is empty', async () => {
    await mw({}, {}, next);
    expect(next.called).to.be.true;
    expect(repoStub.findAllStaffMembers.called).to.be.false;
  });

  it('should populate the staff when found', async () => {
    repoStub.findAllStaffMembers.resolves(staff);
    await mw(req, res, next);
    expect(repoStub.findAllStaffMembers.calledWith('TEST-PROVIDER')).to.be.true;
    expect(res.provider.staff).to.deep.equal(staff);
    expect(next.called).to.be.true;
  });

  it('should call next with an error when repo query fails', async () => {
    repoStub.findAllStaffMembers.rejects(new Error('FORCED-ERROR'));
    await mw(req, res, next);

    expect(repoStub.findAllStaffMembers.calledWith('TEST-PROVIDER')).to.be.true;
    expect(next.called).to.be.true;

    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
