'use strict';

const { omit } = require('lodash');
const PROVIDER_COLLECTION = 'ServiceProvider';

class ServiceProviderRepository {
  constructor(firestore) {
    this.firestore = firestore;
  }

  async create(provider) {
    await this.firestore
      .collection(PROVIDER_COLLECTION)
      .doc(provider.ein)
      .create(omit(provider, ['ein']));

    return;
  }
}

module.exports = ServiceProviderRepository;
