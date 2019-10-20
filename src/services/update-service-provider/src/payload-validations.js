'use strict';

module.exports.schema = {
  $async: true,
  $id: 'http://bookit.com/schemas/schema.json',
  type: 'object',
  properties: {
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
