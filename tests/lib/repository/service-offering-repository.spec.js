'use strict';

const { expect } = require('chai');
const { createStubInstance } = require('sinon');
const {
  CollectionReference,
  DocumentReference,
  Firestore,
  WriteBatch
} = require('@google-cloud/firestore');
const ServiceOfferingRepository = require('../../../src/lib/repository/service-offering-repository');

describe('service-offering-repository unit tests', () => {
  let repo, firestore;
  let collectionReference, documentReference, writeBatchReference;

  before(() => {
    firestore = createStubInstance(Firestore);
    collectionReference = createStubInstance(CollectionReference);
    documentReference = createStubInstance(DocumentReference);
    writeBatchReference = createStubInstance(WriteBatch);
    collectionReference.doc.returns(documentReference);
    documentReference.collection.returns(collectionReference);
    firestore.collection.returns(collectionReference);
    firestore.batch.returns(writeBatchReference);
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
    writeBatchReference.delete.resetHistory();
    writeBatchReference.commit.resetHistory();
    firestore.batch.resetHistory();
  });

  context('create', () => {
    it('should save the document', () => {
      collectionReference.add.resolves({ id: 'TEST' });
      const service = {
        styleId: 'FADE',
        description: 'We give the best fade with super highly trained staff.',
        price: 15.0,
        currency: 'USD'
      };

      expect(repo.create('TEST-PROVIDER', service)).to.be.fulfilled.then(
        documentId => {
          expect(
            collectionReference.add.calledWith({
              styleId: 'FADE',
              description:
                'We give the best fade with super highly trained staff.',
              price: 15.0,
              currency: 'USD'
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
              currency: 'USD'
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
              currency: 'USD'
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
        price: 40.58,
        styleId: 'FADE',
        description: 'Beard Trim',
        serviceId: 'SERVICE1'
      },
      {
        styleId: 'CUSTOM',
        description: 'Beard Trim',
        currency: 'USD',
        price: 40.58,
        serviceId: 'SERVICE2'
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

  context('deleteAllForProvider', () => {
    const services = [
      {
        ref: {}
      },
      {
        ref: {}
      }
    ];
    it('should trigger the delete in batch', () => {
      const querySnapshotSub = {
        forEach: func => services.forEach(func),
        size: 2
      };

      collectionReference.get.resolves(querySnapshotSub);
      writeBatchReference.delete.returns();
      writeBatchReference.commit.resolves();
      expect(repo.deleteAllForProvider('TEST-PROVIDER')).to.be.fulfilled.then(
        () => {
          expect(firestore.batch.called).to.be.true;
          expect(writeBatchReference.delete.callCount).to.equal(2);
          expect(writeBatchReference.commit.called).to.be.true;
        }
      );
    });

    it('should do nothing if no services exist', () => {
      const querySnapshotSub = {
        docs: [],
        size: 0
      };

      collectionReference.get.resolves(querySnapshotSub);
      expect(repo.deleteAllForProvider('TEST-PROVIDER')).to.be.fulfilled.then(
        () => {
          expect(firestore.batch.called).to.be.false;
        }
      );
    });
  });

  context('update', () => {
    it('should resolve', () => {
      const service = {
        styleId: 'FADE',
        description: 'We give the best fade with super highly trained staff.',
        price: 15.0,
        currency: 'USD',
        serviceId: 'SERVICE1'
      };

      documentReference.set.resolves();
      expect(
        repo.update('TEST', 'TEST-OFFERING', service)
      ).to.be.fulfilled.then(() => {
        expect(collectionReference.doc.calledWith('TEST')).to.be.true;
        expect(collectionReference.doc.calledWith('TEST-OFFERING')).to.be.true;
        expect(documentReference.set.called).to.be.true;
      });
    });
  });
});
