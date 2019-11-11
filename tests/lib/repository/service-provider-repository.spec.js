'use strict';

const { expect } = require('chai');
const { createStubInstance } = require('sinon');
const {
  CollectionReference,
  DocumentReference,
  Firestore
} = require('@google-cloud/firestore');
const ServiceProviderRepository = require('../../../src/lib/repository/service-provider-repository');

const provider = {
  businessName: 'Test Business',
  address: {
    streetAddress: '1234 Home Street',
    zip: '98765',
    city: 'Palo Alto',
    state: 'CA'
  },
  priceRanges: ['$', '$$$'],
  serviceSpecificPriceRanges: {
    FADE: ['$'],
    UPDO: ['$$']
  }
};

describe('service-provider-repository unit tests', () => {
  let repo, firestore;
  let collectionReference, documentReference;

  before(() => {
    firestore = createStubInstance(Firestore);
    collectionReference = createStubInstance(CollectionReference);
    documentReference = createStubInstance(DocumentReference);
    collectionReference.doc.returns(documentReference);
    documentReference.collection.returns(collectionReference);
    firestore.collection.returns(collectionReference);

    repo = new ServiceProviderRepository(firestore);
  });

  afterEach(() => {
    documentReference.get.resetHistory();
    documentReference.set.resetHistory();
    documentReference.delete.resetHistory();
    documentReference.create.resetHistory();
    collectionReference.doc.resetHistory();
    collectionReference.where.resetHistory();
    documentReference.collection.resetHistory();
    documentReference.create.resetHistory();
    collectionReference.add.resetHistory();
    firestore.runTransaction.resetHistory();
    documentReference.delete.resetHistory();
  });

  context('create', () => {
    it('should save the document', () => {
      collectionReference.add.resolves({ id: 'TEST' });

      expect(repo.create(provider)).to.be.fulfilled.then(documentId => {
        expect(collectionReference.add.calledWith(provider)).to.be.true;
        expect(documentId).to.equal('TEST');
      });
    });
  });

  context('findProviderByEin', () => {
    it('should return a first found document', () => {
      collectionReference.where.returns(documentReference);
      documentReference.get.resolves({
        docs: [
          {
            id: 'TEST-ID',
            data: () => provider
          }
        ],
        empty: false
      });

      expect(repo.findProviderByEin(provider.ein)).to.be.fulfilled.then(
        result => {
          expect(result).to.deep.equal({
            providerId: 'TEST-ID',
            businessName: 'Test Business',
            address: {
              streetAddress: '1234 Home Street',
              zip: '98765',
              city: 'Palo Alto',
              state: 'CA'
            }
          });
        }
      );
    });

    it('should return nothing if no documents are found', () => {
      collectionReference.where.returns(documentReference);
      documentReference.get.resolves({
        empty: true
      });

      expect(repo.findProviderByEin('12-1231233')).to.be.fulfilled.then(
        result => {
          expect(result).to.deep.equal({});
        }
      );
    });
  });

  context('findByProviderId', () => {
    it('should return provider when found', () => {
      documentReference.get.resolves({
        id: 'TEST-ID',
        data: () => provider,
        get: option => provider[option],
        exists: true
      });

      expect(repo.findByProviderId('PROVIDER-ID')).to.be.fulfilled.then(
        response => {
          expect(response).to.deep.equal({
            providerId: 'TEST-ID',
            businessName: 'Test Business',
            address: {
              streetAddress: '1234 Home Street',
              zip: '98765',
              city: 'Palo Alto',
              state: 'CA'
            }
          });
        }
      );
    });

    it('should return empty object when nothing is found', () => {
      documentReference.get.resolves({
        exists: false
      });

      expect(repo.findByProviderId('PROVIDER-ID')).to.be.fulfilled.then(
        response => {
          expect(response).to.deep.equal({});
        }
      );
    });

    it('should return empty object when doc reference is undefined', () => {
      documentReference.get.resolves(undefined);

      expect(repo.findByProviderId('PROVIDER-ID')).to.be.fulfilled.then(
        response => {
          expect(response).to.deep.equal({});
        }
      );
    });
  });

  context('findByOwnerUid', () => {
    it('should return a first found document', () => {
      collectionReference.where.returns(documentReference);
      documentReference.get.resolves({
        docs: [
          {
            id: 'TEST-ID',
            data: () => provider
          }
        ],
        empty: false
      });

      expect(repo.findByOwnerUid('OWNER-ID')).to.be.fulfilled.then(
        result => {
          expect(result).to.deep.equal({
            providerId: 'TEST-ID',
            businessName: 'Test Business',
            address: {
              streetAddress: '1234 Home Street',
              zip: '98765',
              city: 'Palo Alto',
              state: 'CA'
            }
          });
        }
      );
    });

    it('should return nothing if no documents are found', () => {
      collectionReference.where.returns(documentReference);
      documentReference.get.resolves({
        empty: true
      });

      expect(repo.findByOwnerUid('OWNER-ID')).to.be.fulfilled.then(
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

    const results = [
      {
        id: 'provider-id',
        data: () => provider
      }
    ];

    it('should return the results', () => {
      const snapshot = {
        empty: false,
        docs: results
      };

      const query = collectionReference;
      query.where.returns(query);
      query.select.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search(options)).to.be.fulfilled.then(data => {
        expect(data).to.deep.equal([
          {
            providerId: 'provider-id',
            address: provider.address,
            businessName: provider.businessName,
            priceRanges: provider.priceRanges
          }
        ]);
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

      const query = collectionReference;
      query.where.returns(query);
      query.select.returns(query);
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
        docs: results
      };

      const query = collectionReference;
      query.where.returns(query);
      query.select.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search({})).to.be.fulfilled.then(data => {
        expect(data).to.deep.equal([
          {
            providerId: 'provider-id',
            address: provider.address,
            businessName: provider.businessName,
            priceRanges: provider.priceRanges
          }
        ]);
        expect(query.where.calledWith('address.zip')).to.be.false;
        expect(query.where.calledWith('address.state')).to.be.false;
        expect(query.where.calledWith('address.city')).to.be.false;
        expect(query.where.calledWith('businessName')).to.be.false;
      });
    });

    it('should return and all records if no options are provided', () => {
      const snapshot = {
        empty: false,
        docs: results
      };

      const query = collectionReference;
      query.where.returns(query);
      query.select.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search()).to.be.fulfilled.then(data => {
        expect(data).to.deep.equal([
          {
            providerId: 'provider-id',
            address: provider.address,
            businessName: provider.businessName,
            priceRanges: provider.priceRanges
          }
        ]);
        expect(query.where.calledWith('address.zip')).to.be.false;
        expect(query.where.calledWith('address.state')).to.be.false;
        expect(query.where.calledWith('address.city')).to.be.false;
        expect(query.where.calledWith('businessName')).to.be.false;
      });
    });

    it('should filter based on overall price ranges as no style is provided', () => {
      const providerToBeFiltered = {
        businessName: 'Test Business',
        address: {
          streetAddress: '1234 Home Street',
          zip: '98765',
          city: 'Palo Alto',
          state: 'CA'
        },
        priceRanges: ['$$$$'],
        serviceSpecificPriceRanges: {
          FADE: ['$$$$']
        }
      };

      const options = {
        priceRange: '$$'
      };

      const results = [
        {
          id: 'providerNotFiltered',
          data: () => provider
        },
        {
          id: 'provideFiltered',
          data: () => providerToBeFiltered
        }
      ];

      const snapshot = {
        empty: false,
        docs: results
      };

      const query = collectionReference;
      query.where.returns(query);
      query.select.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search(options)).to.be.fulfilled.then(data => {
        expect(data.length).to.equal(1);
        expect(data).to.deep.equal([
          {
            providerId: 'providerNotFiltered',
            address: provider.address,
            businessName: provider.businessName,
            priceRanges: provider.priceRanges
          }
        ]);
      });
    });

    it('should filter based on overall offering price ranges as style is provided', () => {
      const providerToBeFiltered = {
        businessName: 'Test Business',
        address: {
          streetAddress: '1234 Home Street',
          zip: '98765',
          city: 'Palo Alto',
          state: 'CA'
        },
        priceRanges: ['$$$$'],
        serviceSpecificPriceRanges: {
          FADE: ['$$$$']
        }
      };

      const options = {
        priceRange: '$$',
        styles: 'FADE'
      };

      const results = [
        {
          id: 'providerNotFiltered',
          data: () => provider
        },
        {
          id: 'provideFiltered',
          data: () => providerToBeFiltered
        }
      ];

      const snapshot = {
        empty: false,
        docs: results
      };

      const query = collectionReference;
      query.where.returns(query);
      query.select.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search(options)).to.be.fulfilled.then(data => {
        expect(data.length).to.equal(1);
        expect(data).to.deep.equal([
          {
            providerId: 'providerNotFiltered',
            address: provider.address,
            businessName: provider.businessName,
            priceRanges: provider.serviceSpecificPriceRanges.FADE
          }
        ]);
      });
    });

    it('should apply search if data is missing on document for price ranges it will just not be considered', () => {
      const providerMissingData = {
        businessName: 'Test Business',
        address: {
          streetAddress: '1234 Home Street',
          zip: '98765',
          city: 'Palo Alto',
          state: 'CA'
        }
      };

      const options = {
        styles: 'FADE'
      };

      const results = [
        {
          id: 'providerMissingData',
          data: () => providerMissingData
        }
      ];

      const snapshot = {
        empty: false,
        docs: results
      };

      const query = collectionReference;
      query.where.returns(query);
      query.select.returns(query);
      query.get.resolves(snapshot);

      firestore.collection.returns(query);

      expect(repo.search(options)).to.be.fulfilled.then(data => {
        expect(data.length).to.equal(1);
        expect(data).to.deep.equal([
          {
            providerId: 'providerMissingData',
            address: provider.address,
            businessName: provider.businessName,
            priceRanges: []
          }
        ]);
      });
    });
  });

  context('update', () => {
    it('should resolve if provider exists', () => {
      firestore.runTransaction.callsFake(
        async func => await func(documentReference)
      );
      documentReference.get.resolves({
        data: () => provider,
        exists: true
      });

      documentReference.set.resolves();
      expect(repo.update('TEST', provider)).to.be.fulfilled.then(() => {
        expect(collectionReference.doc.calledWith('TEST')).to.be.true;
        expect(documentReference.set.called).to.be.true;
      });
    });

    it('should reject if provider does not exists', () => {
      firestore.runTransaction.callsFake(
        async func => await func(documentReference)
      );
      documentReference.get.resolves({
        exists: false
      });

      documentReference.set.resolves();
      expect(repo.update('TEST', provider)).to.be.rejected.then(err => {
        expect(collectionReference.doc.calledWith('TEST')).to.be.true;
        expect(documentReference.set.called).to.be.false;
        expect(err.code).to.equal('PROVIDER_NOT_EXISTING');
      });
    });
  });

  context('delete', () => {
    it('should resolve', () => {
      documentReference.delete.resolves();
      expect(repo.delete('TEST', provider)).to.be.fulfilled.then(() => {
        expect(collectionReference.doc.calledWith('TEST')).to.be.true;
        expect(documentReference.delete.called).to.be.true;
      });
    });
  });
});
