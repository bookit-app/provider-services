'use strict';

const { expect } = require('chai');
const { createStubInstance } = require('sinon');
const {
  CollectionReference,
  DocumentReference,
  Firestore
} = require('@google-cloud/firestore');
const StaffMembershipRequestRepository = require('../../../src/lib/repository/staff-membership-request-repository');

const request = {
  providerId: 'TEST-PROVIDER',
  requestorUid: 'TEST-REQUESTOR',
  requestedStaffMemberEmail: 'test@test.com'
};

describe('staff-membership-request-repository unit tests', () => {
  let repo, firestore;
  let collectionReference, documentReference;

  before(() => {
    firestore = createStubInstance(Firestore);
    collectionReference = createStubInstance(CollectionReference);
    documentReference = createStubInstance(DocumentReference);
    collectionReference.doc.returns(documentReference);
    documentReference.collection.returns(collectionReference);
    firestore.collection.returns(collectionReference);

    repo = new StaffMembershipRequestRepository(firestore);
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

      expect(repo.create(request)).to.be.fulfilled.then(documentId => {
        expect(
          collectionReference.add.calledWith({
            providerId: 'TEST-PROVIDER',
            requestorUid: 'TEST-REQUESTOR',
            requestedStaffMemberEmail: 'test@test.com',
            requestedStaffMemberUid: '',
            status: 'NEW'
          })
        ).to.be.true;
        expect(documentId).to.equal('TEST');
      });
    });
  });
});
