'use strict';

const PROVIDER_COLLECTION = require('./service-provider-repository')
  .COLLECTION_NAME;
const SERVICES_SUBCOLLECTION = 'services';

class ServiceOfferingRepository {
  constructor(firestore) {
    this.firestore = firestore;
  }

  /**
   * Returns the name of the collection supported
   * by this repository
   *
   * @readonly
   * @memberof ServiceOfferingRepository
   */
  get collection() {
    return SERVICES_SUBCOLLECTION;
  }

  /**
   * Create a new document as a service offering under the provider
   *
   * @param {String} providerId
   * @param {*} service
   * @returns {String} documentId
   * @memberof ServiceProviderRepository
   */
  async create(providerId, service) {
    if (service.isCustomServiceType) {
      service.styleId = 'CUSTOM';
    }

    const document = await this.firestore
      .collection(PROVIDER_COLLECTION)
      .doc(providerId)
      .collection(SERVICES_SUBCOLLECTION)
      .add({
        styleId: service.styleId || 'CUSTOM',
        description: service.description,
        price: service.price,
        currency: service.currency || 'USD',
        isCustomServiceType: service.isCustomServiceType || false
      });

    return document.id;
  }

  /**
   * Returns an array containing all the services
   * related to the given provider
   *
   * @param {String} providerId
   * @returns {[*]} services
   * @memberof ServiceOfferingRepository
   */
  async findAllServiceOfferings(providerId) {
    const querySnapshot = await this.firestore
      .collection(PROVIDER_COLLECTION)
      .doc(providerId)
      .collection(SERVICES_SUBCOLLECTION)
      .get();

    return querySnapshot.docs.map(doc => doc.data());
  }
}

module.exports = ServiceOfferingRepository;
module.exports.COLLECTION_NAME = SERVICES_SUBCOLLECTION;
module.exports.serviceOfferingRepositoryInstance = new ServiceOfferingRepository(
  require('./firestore')
);
