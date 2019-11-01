'use strict';

module.exports.schema = {
  $async: true,
  $id: 'http://bookit.com/schemas/update-service-offering-schema.json',
  type: 'object',
  required: ['description', 'price'],
  properties: {
    description: {
      type: 'string'
    },
    price: {
      type: 'number',
      minimum: 0
    },
    currency: {
      type: 'string',
      minLength: 3,
      maxLength: 3,
      enum: ['USD']
    }
  }
};
