'use strict';

const PROVIDER_COLLECTION = 'ServiceProvider';
const { v4 } = require('uuid');
const supportedSearchParams = ['city', 'state', 'zip', 'businessName'];

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

  /**
   * Search for Providers based on the input options
   * available options are defined in supportedSearchParams
   *
   * @param {*} options
   * @returns
   * @memberof ServiceProviderRepository
   */
  async search(options) {
    const collection = this.firestore.collection(PROVIDER_COLLECTION);
    const query = buildSearchRequest(collection, options);
    const results = [];
    const querySnapshot = await query.get();

    if (querySnapshot && !querySnapshot.empty) {
      querySnapshot.forEach(docSnapshot => {
        results.push(docSnapshot.data());
      });
    }

    return results;
  }
}

/**
 * Processes the options for query and builds a firestore
 * query request which can be used
 *
 * @param {*} collection
 * @param {*} options
 * @returns {Query}
 */
function buildSearchRequest(collection, options) {
  let query = collection;

  if (!options) return query;

  if (options.businessName) {
    query = query.where('businessName', '==', options.businessName);
  }

  if (options.city) {
    query = query.where('address.city', '==', options.city);
  }
  if (options.state) {
    query = query.where('address.state', '==', options.state);
  }

  if (options.zip) {
    query = query.where('address.zip', '==', options.zip);
  }

  return query;
}

module.exports = ServiceProviderRepository;
module.exports.supportedSearchParams = supportedSearchParams;
module.exports.serviceProviderRepositoryInstance = new ServiceProviderRepository(
  require('./firestore')
);
