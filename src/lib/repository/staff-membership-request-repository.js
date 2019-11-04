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
    await this.firestore
      .collection(COLLECTION_NAME)
      .doc(requestId)
      .set({ status: status }, { merge: true });

    return;
  }

  /**
   * Query for a request by the id
   *
   * @param { String } providerId
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
    document.requestId = documentReference.id;
    return document;
  }
}

module.exports = StaffMembershipRequestRepository;
module.exports.COLLECTION_NAME = COLLECTION_NAME;
module.exports.staffMembershipRequestRepositoryInstance = new StaffMembershipRequestRepository(
  require('./firestore')
);
