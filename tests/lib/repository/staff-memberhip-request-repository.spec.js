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
  businessName: 'TEST-BUSINESS-NAME',
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
    collectionReference.where.returns(documentReference);
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
            businessName: 'TEST-BUSINESS-NAME',
            requestorUid: 'TEST-REQUESTOR',
            requestedStaffMemberEmail: 'test@test.com',
            status: 'NEW'
          })
        ).to.be.true;
        expect(documentId).to.equal('TEST');
      });
    });
  });

  context('findById', () => {
    it('should return request when found', () => {
      documentReference.get.resolves({
        id: 'TEST-ID',
        data: () => request,
        exists: true
      });

      expect(repo.findById('TEST-ID')).to.be.fulfilled.then(response => {
        expect(response).to.deep.equal({
          id: 'TEST-ID',
          providerId: 'TEST-PROVIDER',
          businessName: 'TEST-BUSINESS-NAME',
          requestorUid: 'TEST-REQUESTOR',
          requestedStaffMemberEmail: 'test@test.com'
        });
      });
    });

    it('should return empty object when nothing is found', () => {
      documentReference.get.resolves({
        exists: false
      });

      expect(repo.findById('TEST-ID')).to.be.fulfilled.then(response => {
        expect(response).to.deep.equal({});
      });
    });

    it('should return empty object when doc reference is undefined', () => {
      documentReference.get.resolves(undefined);

      expect(repo.findById('TEST-ID')).to.be.fulfilled.then(response => {
        expect(response).to.deep.equal({});
      });
    });
  });

  context('findByRequestedEmail', () => {
    it('should return found documents', () => {
      documentReference.get.resolves({
        forEach: func =>
          func({
            id: 'TEST-ID',
            data: () => request
          }),
        empty: false
      });

      expect(repo.findByRequestedEmail('TEST-EMAIL')).to.be.fulfilled.then(
        result => {
          expect(result).to.deep.equal([
            {
              id: 'TEST-ID',
              providerId: 'TEST-PROVIDER',
              businessName: 'TEST-BUSINESS-NAME',
              requestorUid: 'TEST-REQUESTOR',
              requestedStaffMemberEmail: 'test@test.com'
            }
          ]);
        }
      );
    });

    it('should return nothing if no documents are found', () => {
      documentReference.get.resolves({
        empty: true
      });

      expect(repo.findByRequestedEmail('TEST-EMAIL')).to.be.fulfilled.then(
        result => {
          expect(result).to.deep.equal([]);
        }
      );
    });
  });

  context('update', () => {
    it('should resolve if request exists', () => {
      firestore.runTransaction.callsFake(
        async func => await func(documentReference)
      );
      documentReference.get.resolves({
        data: () => request,
        exists: true
      });

      documentReference.set.resolves();
      expect(
        repo.update('TEST-ID', {
          status: 'ACCEPTED',
          staffMemberUid: 'TEST'
        })
      ).to.be.fulfilled.then(() => {
        expect(collectionReference.doc.calledWith('TEST-ID')).to.be.true;
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
      expect(
        repo.update('TEST-ID', {
          status: 'ACCEPTED',
          staffMemberUid: 'TEST'
        })
      ).to.be.rejected.then(err => {
        expect(collectionReference.doc.calledWith('TEST-ID')).to.be.true;
        expect(documentReference.set.called).to.be.false;
        expect(err.code).to.equal('REQUEST_NOT_EXISTING');
      });
    });
  });
});
