'use strict';

const COLLECTION_NAME = 'StaffMembershipRequests';
const logger = require('../util/logger');
const { isEmpty } = require('lodash');

class StaffMembershipRequestRepository {
  constructor(firestore) {
    this.firestore = firestore;
  }

  /**
   * Create a new document as a staff membership request
   *
   * @param {*} request
   * @returns {Promise<String>} documentId
   * @memberof StaffMembershipRequestRepository
   */
  async create(request) {
    const document = await this.firestore.collection(COLLECTION_NAME).add({
      providerId: request.providerId,
      businessName: request.businessName,
      requestorUid: request.requestorUid,
      requestedStaffMemberEmail: request.requestedStaffMemberEmail,
      status: 'NEW'
    });

    logger.info(
      `New staff member request ${document.id} associated with provider ${request.providerId} created`
    );

    return document.id;
  }

  /**
   * Update the membership request
   *
   * @param {String} requestId
   * @param {String} status
   * @returns {Promise<void>}
   * @memberof StaffMembershipRequestRepository
   */
  async update(requestId, status) {
    const documentReference = this.firestore
      .collection(COLLECTION_NAME)
      .doc(requestId);

    return this.firestore.runTransaction(async t => {
      const document = await t.get(documentReference);

      // The provider has been deleted so nothing to update at this point
      if (isEmpty(document) || !document.exists) {
        const err = new Error();
        err.code = 'REQUEST_NOT_EXISTING';
        return Promise.reject(err);
      }

      await t.set(documentReference, { status: status }, { merge: true });
    });
  }

  /**
   * Query for a request by the id
   *
   * @param { String } requestId
   * @returns {*}
   * @memberof StaffMembershipRequestRepository
   */
  async findById(requestId) {
    const documentReference = await this.firestore
      .collection(COLLECTION_NAME)
      .doc(requestId)
      .get();

    if (isEmpty(documentReference) || !documentReference.exists) {
      return {};
    }

    const document = documentReference.data();
    document.id = documentReference.id;
    return document;
  }

  /**
   * Query for a request by the staff member email
   *
   * @param { String } email
   * @returns {*}
   * @memberof StaffMembershipRequestRepository
   */
  async findByRequestedEmail(email) {
    const querySnapshot = await this.firestore
      .collection(COLLECTION_NAME)
      .where('requestedStaffMemberEmail', '==', email)
      .get();

    let requests = [];
    if (isEmpty(querySnapshot) || !querySnapshot.empty) {
      querySnapshot.forEach(documentSnapshot => {
        const document = documentSnapshot.data();
        document.id = documentSnapshot.id;
        requests.push(document);
      });
    }

    return requests;
  }
}

module.exports = StaffMembershipRequestRepository;
module.exports.COLLECTION_NAME = COLLECTION_NAME;
module.exports.staffMembershipRequestRepositoryInstance = new StaffMembershipRequestRepository(
  require('./firestore')
);
