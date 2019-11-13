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

  it('should return the collection name', () => {
    expect(repo.collection).to.equal('staff');
  });

  context('create', () => {
    it('should save the document', () => {
      documentReference.set.resolves();

      expect(repo.create('TEST-PROVIDER', staffMember)).to.be.fulfilled.then(
        documentId => {
          expect(collectionReference.doc.calledWith('TEST-PROVIDER')).to.be
            .true;
          expect(collectionReference.doc.calledWith('TEST-UID')).to.be.true;
          expect(
            documentReference.set.calledWith(
              {
                email: 'test@test.com',
                name: 'TEST-NAME'
              },
              { merge: true }
            )
          ).to.be.true;
          expect(documentId).to.equal('TEST-UID');
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

      expect(
        repo.findByProviderIdAndEmail('TEST-PROVIDER', 'test@test.com')
      ).to.be.fulfilled.then(result => {
        expect(result).to.deep.equal({});
      });
    });
  });

  context('findAllStaffMembers', () => {
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

    it('should return an array of staff members', () => {
      const querySnapshotSub = {
        docs: [
          {
            data: () => staff[0]
          },
          {
            data: () => staff[1]
          }
        ]
      };
      collectionReference.get.resolves(querySnapshotSub);

      expect(repo.findAllStaffMembers('TEST-PROVIDER')).to.be.fulfilled.then(
        results => {
          expect(results).to.deep.equal(staff);
        }
      );
    });
  });
});
