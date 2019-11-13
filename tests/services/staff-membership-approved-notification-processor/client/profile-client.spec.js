'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const ProfileClient = require('../../../../src/services/staff-membership-accepted-notification-processor/src/client/profile-client');

const profile = {
  address: {
    city: 'city',
    state: 'NY',
    streetAddress: 'a street somewhere',
    zip: 12345
  },
  birthday: '11-13-2019',
  email: 'test@test.com',
  firstName: 'test-first-name',
  gender: 'M',
  isProvider: false,
  lastName: 'test-last-name',
  phoneNumber: '123-123-1234'
};

describe('provider-client unit tests', () => {
  let client, httpStub, tokenStub;

  before(() => {
    httpStub = {
      get: stub().resolves(profile)
    };

    tokenStub = {
      getToken: stub().resolves('TEST-TOKEN')
    };

    client = new ProfileClient(httpStub, tokenStub, 'http://localhost:8080');
  });

  it('should make an HTTP GET request', () => {
    expect(client.queryProfile('TEST-PROFILE-ID')).to.be.fulfilled.then(
      response => {
        expect(response).to.deep.equal(profile);
        expect(tokenStub.getToken.called).to.be.true;
        expect(httpStub.get.called).to.be.true;
        expect(
          httpStub.get.calledWith({
            url: 'http://localhost:8080/admin/profile/TEST-PROFILE-ID',
            auth: {
              bearer: 'TEST-TOKEN'
            },
            json: true
          })
        ).to.be.true;
      }
    );
  });
});
