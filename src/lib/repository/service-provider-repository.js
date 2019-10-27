'use strict';

const PROVIDER_COLLECTION = 'ServiceProvider';
const supportedSearchParams = [
  'city',
  'state',
  'zip',
  'businessName',
  'styles'
];
const { omit, isEmpty } = require('lodash');

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
    const document = await this.firestore
      .collection(PROVIDER_COLLECTION)
      .add(provider);

    return document.id;
  }

  update(providerId, provider) {
    return this.firestore.runTransaction(async t => {
      const documentReference = await t
        .collection(PROVIDER_COLLECTION)
        .doc(providerId)
        .get();

      // The provider has been deleted so nothing to update at this point
      if (isEmpty(documentReference) || !documentReference.exists) {
        const err = new Error();
        err.code = 'PROVIDER_NOT_EXISTING';
        return Promise.reject(err);
      }

      await t
        .collection(PROVIDER_COLLECTION)
        .doc(providerId)
        .set(provider, { merge: true });
    });
  }

  /**
   * Trigger the provider delete processing
   *
   * @param {String} providerId
   * @returns {void}
   * @memberof ServiceProviderRepository
   */
  delete(providerId) {
    return this.firestore
      .collection(PROVIDER_COLLECTION)
      .doc(providerId)
      .delete();
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
   * Query for a provider by the provider
   * additionally options can be used to request
   * a specific sub map of the provider
   *
   * @param { select: string } providerId
   * @param {*} options
   * @returns
   * @memberof ServiceProviderRepository
   */
  async findByProviderId(providerId) {
    const documentReference = await this.firestore
      .collection(PROVIDER_COLLECTION)
      .doc(providerId)
      .get();

    if (isEmpty(documentReference) || !documentReference.exists) {
      return {};
    }

    return omit(documentReference.data(), 'styles');
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
    const querySnapshot = await query.select('businessName', 'address').get();

    if (querySnapshot && !querySnapshot.empty) {
      querySnapshot.forEach(docSnapshot => {
        const data = docSnapshot.data();
        data.providerId = docSnapshot.id;
        results.push(data);
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

  if (options.styles) {
    query = query.where('styles', 'array-contains', options.styles);
  }

  return query;
}

module.exports = ServiceProviderRepository;
module.exports.COLLECTION_NAME = PROVIDER_COLLECTION;
module.exports.supportedSearchParams = supportedSearchParams;
module.exports.serviceProviderRepositoryInstance = new ServiceProviderRepository(
  require('./firestore')
);
