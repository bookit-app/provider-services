'use strict';

const COLLECTION_NAME = 'StaffMembershipRequests';
const logger = require('../util/logger');

class StaffMembershipRequestRepository {
  constructor(firestore) {
    this.firestore = firestore;
  }

  /**
   * Create a new document as a staff membership request
   *
   * @param {*} request
   * @returns {String} documentId
   * @memberof ServiceProviderRepository
   */
  async create(request) {
    const document = await this.firestore
      .collection(COLLECTION_NAME)
      .add({
        providerId: request.providerId,
        requestorUid: request.requestorUid,
        requestedStaffMemberEmail: request.requestedStaffMemberEmail,
        requestedStaffMemberUid: '', 
        status: 'NEW'
      });

    logger.info(
      `New staff member request ${document.id} associated with provider ${request.providerId} created`
    );

    return document.id;
  }
}

module.exports = StaffMembershipRequestRepository;
module.exports.COLLECTION_NAME = COLLECTION_NAME;
module.exports.staffMembershipRequestRepositoryInstance = new StaffMembershipRequestRepository(
  require('./firestore')
);
