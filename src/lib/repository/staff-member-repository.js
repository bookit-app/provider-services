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
    await this.firestore
      .collection(PROVIDER_COLLECTION)
      .doc(providerId)
      .collection(STAFF_SUBCOLLECTION)
      .doc(staffMember.staffMemberUid)
      .set(
        {
          email: staffMember.email,
          name: staffMember.name
        },
        { merge: true }
      );

    logger.info(
      `New staff member ${staffMember.staffMemberUid} associated with provider ${providerId}`
    );

    return staffMember.staffMemberUid;
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
