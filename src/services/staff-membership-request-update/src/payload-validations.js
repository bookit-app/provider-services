'use strict';

module.exports.schema = {
  $async: true,
  $id: 'http://bookit.com/schemas/staff-membership-request-update-schema.json',
  type: 'object',
  required: ['status'],
  additionalProperties: false,
  properties: {
    status: {
      type: 'string',
      enum: ['ACCEPTED', 'DECLINED']
    }
  }
};
