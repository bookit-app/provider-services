'use strict';

const PROVIDER_COLLECTION = 'ServiceProvider';
const { v4 } = require('uuid');

class ServiceProviderRepository {
  constructor(firestore) {
    this.firestore = firestore;
  }

  /**
   * Create a new document for the service provider
   *
   * @param {*} provider
   * @returns {String} documentId
   * @memberof ServiceProviderRepository
   */
  async create(provider) {
    const documentId = v4();

    await this.firestore
      .collection(PROVIDER_COLLECTION)
      .doc(documentId)
      .create(provider);

    return documentId;
  }

  /**
   * Query for a provider based on the EIN code
   * it is assumed that only 1 service provider
   * can exist with this code therefore return
   * the first one found
   *
   * @param {String} ein
   * @returns {profile | {}}
   * @memberof ServiceProviderRepository
   */
  async findProviderByEin(ein) {
    const snapshot = await this.firestore
      .collection(PROVIDER_COLLECTION)
      .where('ein', '==', ein)
      .get();

    if (snapshot && !snapshot.empty) {
      // As we enforce a single EIN return the first
      return snapshot.docs[0].data();
    }

    return {};
  }
}

module.exports = ServiceProviderRepository;

module.exports.serviceProviderRepositoryInstance = new ServiceProviderRepository(
  require('./firestore')
);
