'use strict';

const { expect } = require('chai');
const { stub, createStubInstance } = require('sinon');
const Firestore = require('@google-cloud/firestore');
const { Query } = require('@google-cloud/firestore');
const ServiceProviderRepository = require('../../../src/lib/repository/service-provider-repository');

describe('service-provider-repository unit tests', () => {
  let repo, firestore;

  before(() => {
    firestore = createStubInstance(Firestore);
    repo = new ServiceProviderRepository(firestore);
  });

  context('create', () => {
    it('should save the document with ein as the key', () => {
      const documentStub = {
        create: stub()
      };
      const collectionStub = {
        doc: stub().returns(documentStub)
      };
      firestore.collection.returns(collectionStub);

      const provider = {
        ein: '12-1234567',
        businessName: 'TESTBUSINESS'
      };

      expect(repo.create(provider)).to.be.fulfilled.then(documentId => {
        expect(collectionStub.doc.calledWith(documentId)).to.be.true;
        expect(documentStub.create.calledWith(provider)).to.be.true;
      });
    });
  });

  context('findProviderByEin', () => {
    it('should return a first found document', () => {
      const provider = {
        ein: '12-1234567',
        businessName: 'TESTBUSINESS'
      };

      const snapshot = {
        empty: false,
        docs: [{ data: () => provider }]
      };
      const getStub = stub().resolves(snapshot);
      const collectionStub = {
        where: stub().returns({
          get: getStub
        })
      };
      firestore.collection.returns(collectionStub);

      expect(repo.findProviderByEin(provider.ein)).to.be.fulfilled.then(
        result => {
          expect(result).to.deep.equal(provider);
        }
      );
    });

    it('should return nothing if no documents are found', () => {
      const snapshot = {
        empty: true,
        docs: []
      };
      const getStub = stub().resolves(snapshot);
      const collectionStub = {
        where: stub().returns({
          get: getStub
        })
      };
      firestore.collection.returns(collectionStub);

      expect(repo.findProviderByEin('12-1231233')).to.be.fulfilled.then(
        result => {
          expect(result).to.deep.equal({});
        }
      );
    });
  });

  context('search', () => {
    const options = {
      zip: '98765',
      state: 'CA',
      businessName: 'TEST',
      city: 'TEST'
    };

    const profile = {
      businessName: 'Test Business',
      ownerUid: '057KyiBA50aXpjjeVXKdyIIkOmf1',
      ein: '43-2347647',
      address: {
        city: 'Palo Alto',
        state: 'CA',
        streetAddress: '1234 Home Street',
        zip: '98765'
      },
      phoneNumber: '123-123-1234',
      email: 'test@test.com'
    };

    const results = [
      {
        data: () => profile
      }
    ];

    it('should return the results', () => {
      const snapshot = {
        empty: false,
        forEach: func => results.forEach(func)
      };

      const query = createStubInstance(Query);
      query.where.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search(options)).to.be.fulfilled.then(data => {
        expect(data).to.deep.equal([profile]);
        expect(query.where.calledWith('address.zip')).to.be.true;
        expect(query.where.calledWith('address.state')).to.be.true;
        expect(query.where.calledWith('address.city')).to.be.true;
        expect(query.where.calledWith('businessName')).to.be.true;
      });
    });

    it('should return and empty array', () => {
      const snapshot = {
        empty: true
      };

      const query = createStubInstance(Query);
      query.where.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search(options)).to.be.fulfilled.then(data => {
        expect(data).to.deep.equal([]);
        expect(query.where.calledWith('address.zip')).to.be.true;
        expect(query.where.calledWith('address.state')).to.be.true;
        expect(query.where.calledWith('address.city')).to.be.true;
        expect(query.where.calledWith('businessName')).to.be.true;
      });
    });

    it('should return and all records if empty options are provided', () => {
      const snapshot = {
        empty: false,
        forEach: func => results.forEach(func)
      };

      const query = createStubInstance(Query);
      query.where.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search({})).to.be.fulfilled.then(data => {
        expect(data).to.deep.equal([profile]);
        expect(query.where.calledWith('address.zip')).to.be.false;
        expect(query.where.calledWith('address.state')).to.be.false;
        expect(query.where.calledWith('address.city')).to.be.false;
        expect(query.where.calledWith('businessName')).to.be.false;
      });
    });

    it('should return and all records if no options are provided', () => {
      const snapshot = {
        empty: false,
        forEach: func => results.forEach(func)
      };

      const query = createStubInstance(Query);
      query.where.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search()).to.be.fulfilled.then(data => {
        expect(data).to.deep.equal([profile]);
        expect(query.where.calledWith('address.zip')).to.be.false;
        expect(query.where.calledWith('address.state')).to.be.false;
        expect(query.where.calledWith('address.city')).to.be.false;
        expect(query.where.calledWith('businessName')).to.be.false;
      });
    });
  });
});
