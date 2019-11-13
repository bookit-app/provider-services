'use strict';

module.exports.schema = {
  $async: true,
  $id: 'http://bookit.com/schemas/staff-membership-request-schema.json',
  type: 'object',
  required: ['requestedStaffMemberEmail'],
  additionalProperties: false,
  properties: {
    requestedStaffMemberEmail: {
      type: 'string',
      format: 'email'
    }
  }
};
