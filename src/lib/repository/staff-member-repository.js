'use strict';

const PROVIDER_COLLECTION = require('./service-provider-repository')
  .COLLECTION_NAME;
const STAFF_SUBCOLLECTION = 'staff';
const logger = require('../util/logger');

class StaffMemberRepository {
  constructor(firestore) {
    this.firestore = firestore;
  }

  /**
   * Create a new document as a staff member under the provider
   *
   * @param {String} providerId
   * @param {*} staffMember
   * @returns {String} documentId
   * @memberof ServiceProviderRepository
   */
  async create(providerId, staffMember) {
    const document = await this.firestore
      .collection(PROVIDER_COLLECTION)
      .doc(providerId)
      .collection(STAFF_SUBCOLLECTION)
      .add({
        staffMemberUid: staffMember.staffMemberUid,
        email: staffMember.email,
        name: staffMember.name
      });

    logger.info(
      `New staff member ${document.id} associated with provider ${providerId}`
    );

    return document.id;
  }

  async findByProviderIdAndEmail(providerId, email) {
    const querySnapshot = await this.firestore
      .collection(PROVIDER_COLLECTION)
      .doc(providerId)
      .collection(STAFF_SUBCOLLECTION)
      .where('email', '==', email)
      .get();

    if (querySnapshot && !querySnapshot.empty) {
      // Owner can only have 1 business so return the first entry
      const document = querySnapshot.docs[0].data();
      document.staffMemberId = querySnapshot.docs[0].id;
      return document;
    }

    return {};
  }
}

module.exports = StaffMemberRepository;
module.exports.COLLECTION_NAME = STAFF_SUBCOLLECTION;
module.exports.staffMemberRepositoryInstance = new StaffMemberRepository(
  require('./firestore')
);
