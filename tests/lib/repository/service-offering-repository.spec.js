'use strict';

const { expect } = require('chai');
const { createStubInstance } = require('sinon');
const {
  CollectionReference,
  DocumentReference,
  Firestore
} = require('@google-cloud/firestore');
const ServiceOfferingRepository = require('../../../src/lib/repository/service-offering-repository');

describe('service-offering-repository unit tests', () => {
  let repo, firestore;
  let collectionReference, documentReference;

  before(() => {
    firestore = createStubInstance(Firestore);
    collectionReference = createStubInstance(CollectionReference);
    documentReference = createStubInstance(DocumentReference);
    collectionReference.doc.returns(documentReference);
    documentReference.collection.returns(collectionReference);
    firestore.collection.returns(collectionReference);

    repo = new ServiceOfferingRepository(firestore);
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
  });

  context('create', () => {
    it('should save the document', () => {
      collectionReference.add.resolves({ id: 'TEST' });
      const service = {
        styleId: 'FADE',
        description: 'We give the best fade with super highly trained staff.',
        price: 15.0,
        currency: 'USD',
        isCustomServiceType: false
      };

      expect(repo.create('TEST-PROVIDER', service)).to.be.fulfilled.then(
        documentId => {
          expect(
            collectionReference.add.calledWith({
              styleId: 'FADE',
              description:
                'We give the best fade with super highly trained staff.',
              price: 15.0,
              currency: 'USD',
              isCustomServiceType: false
            })
          ).to.be.true;
          expect(documentId).to.equal('TEST');
        }
      );
    });

    it('should return the collection name', () => {
      expect(repo.collection).to.equal('services');
    });

    it('should save the document with defaults', () => {
      collectionReference.add.resolves({ id: 'TEST' });
      const service = {
        description: 'We give the best fade with super highly trained staff.',
        price: 15.0
      };

      expect(repo.create('TEST-PROVIDER', service)).to.be.fulfilled.then(
        documentId => {
          expect(
            collectionReference.add.calledWith({
              styleId: 'CUSTOM',
              description:
                'We give the best fade with super highly trained staff.',
              price: 15.0,
              currency: 'USD',
              isCustomServiceType: false
            })
          ).to.be.true;
          expect(documentId).to.equal('TEST');
        }
      );
    });

    it('should save the document with defaults and force styleId = CUSTOM', () => {
      collectionReference.add.resolves({ id: 'TEST' });
      const service = {
        description: 'We give the best fade with super highly trained staff.',
        price: 15.0,
        isCustomServiceType: true,
        styleId: 'NOT-CUSTOM'
      };

      expect(repo.create('TEST-PROVIDER', service)).to.be.fulfilled.then(
        documentId => {
          expect(
            collectionReference.add.calledWith({
              styleId: 'CUSTOM',
              description:
                'We give the best fade with super highly trained staff.',
              price: 15.0,
              currency: 'USD',
              isCustomServiceType: true
            })
          ).to.be.true;
          expect(documentId).to.equal('TEST');
        }
      );
    });
  });

  context('findAllServiceOfferings', () => {
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

    it('should return an array of offerings', () => {
      const querySnapshotSub = {
        docs: [
          {
            data: () => services[0]
          },
          {
            data: () => services[1]
          }
        ]
      };
      collectionReference.get.resolves(querySnapshotSub);

      expect(
        repo.findAllServiceOfferings('TEST-PROVIDER')
      ).to.be.fulfilled.then(results => {
        expect(results).to.deep.equal(services);
      });
    });

    it('should return an empty array when none exist', () => {
      const querySnapshotSub = {
        docs: []
      };
      collectionReference.get.resolves(querySnapshotSub);

      expect(
        repo.findAllServiceOfferings('TEST-PROVIDER')
      ).to.be.fulfilled.then(results => {
        expect(results).to.deep.equal([]);
      });
    });
  });
});
