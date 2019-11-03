'use strict';

const { expect } = require('chai');
const { createStubInstance } = require('sinon');
const {
  CollectionReference,
  DocumentReference,
  Firestore
} = require('@google-cloud/firestore');
const StaffMembershipRequestRepository = require('../../../src/lib/repository/staff-member-repository');

const staffMember = {
  staffMemberUid: 'TEST-UID',
  email: 'test@test.com',
  name: 'TEST-NAME'
};

describe('staff-member-repository unit tests', () => {
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

      expect(repo.create('TEST-PROVIDER', staffMember)).to.be.fulfilled.then(
        documentId => {
          expect(collectionReference.doc.calledWith('TEST-PROVIDER')).to.be
            .true;
          expect(collectionReference.add.calledWith(staffMember)).to.be.true;
          expect(documentId).to.equal('TEST');
        }
      );
    });
  });

  context('findByProviderIdAndEmail', () => {
    it('should return a first found document', () => {
      collectionReference.where.returns(documentReference);
      documentReference.get.resolves({
        docs: [
          {
            id: 'TEST-ID',
            data: () => staffMember
          }
        ],
        empty: false
      });

      expect(
        repo.findByProviderIdAndEmail('TEST-PROVIDER', 'test@test.com')
      ).to.be.fulfilled.then(result => {
        expect(result).to.deep.equal({
          staffMemberId: 'TEST-ID',
          staffMemberUid: 'TEST-UID',
          email: 'test@test.com',
          name: 'TEST-NAME'
        });
      });
    });

    it('should return nothing if no documents are found', () => {
      collectionReference.where.returns(documentReference);
      documentReference.get.resolves({
        empty: true
      });

      expect(repo.findByProviderIdAndEmail('TEST-PROVIDER', 'test@test.com')).to.be.fulfilled.then(
        result => {
          expect(result).to.deep.equal({});
        }
      );
    });
  });
});
