'use strict';

const { isEmpty } = require('../../../../node_modules/lodash');

/**
 * Populates a specific dynamic async check to
 * determine if the EIN provided for thew new
 * service provider already exists. This will be trigger
 * automatically based on the schema validation with AJV
 *
 * @param {AJV} ajv
 * @param {ServiceProviderRepository} serviceProviderRepository
 */
module.exports.enableDynamicValidationChecks = (
  ajv,
  serviceProviderRepository
) => {
  ajv.addKeyword('einExists', {
    async: true,
    type: 'string',
    validate: checkEinExists
  });

  async function checkEinExists(options, data) {
    const provider = await serviceProviderRepository.findProviderByEin(data);
    return isEmpty(provider);
  }
};

module.exports.schema = {
  $async: true,
  $id: 'http://bookit.com/schemas/schema.json',
  type: 'object',
  required: ['ein', 'businessName', 'address'],
  properties: {
    ein: {
      type: 'string',
      pattern: '^[0-9]{2}-[0-9]{7}$',
      einExists: {}
    },
    businessName: {
      type: 'string',
      minLength: 1
    },
    email: {
      type: 'string',
      format: 'email'
    },
    phoneNumber: {
      type: 'string',
      pattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}$'
    },
    address: {
      type: 'object',
      properties: {
        streetAddress: {
          type: 'string',
          minLength: 1
        },
        city: {
          type: 'string',
          minLength: 1
        },
        state: {
          type: 'string',
          minLength: 2,
          maxLength: 2
        },
        zip: {
          type: 'string',
          minLength: 5,
          maxLength: 5
        }
      },
      required: ['streetAddress', 'city', 'state', 'zip']
    }
  }
};
