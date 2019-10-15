'use strict';

const { expect } = require('chai');
const { stub, createStubInstance } = require('sinon');
const Firestore = require('@google-cloud/firestore');
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
});
