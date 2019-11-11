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
   * Returns the name of the collection supported
   * by this repository
   *
   * @readonly
   * @memberof StaffMemberRepository
   */
  get collection() {
    return STAFF_SUBCOLLECTION;
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

  /**
   * Returns an array containing all the staff members
   * related to the given provider
   *
   * @param {String} providerId
   * @returns {[*]} services
   * @memberof ServiceOfferingRepository
   */
  async findAllStaffMembers(providerId) {
    const querySnapshot = await this.firestore
      .collection(PROVIDER_COLLECTION)
      .doc(providerId)
      .collection(STAFF_SUBCOLLECTION)
      .get();

    return querySnapshot.docs.map(doc => {
      const staffMember = doc.data();
      staffMember.staffMemberId = doc.id;
      return staffMember;
    });
  }
}

module.exports = StaffMemberRepository;
module.exports.staffMemberRepositoryInstance = new StaffMemberRepository(
  require('./firestore')
);
