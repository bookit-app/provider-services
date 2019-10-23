'use strict';

const { isEmpty } = require('lodash');

/**
 * Populates a specific dynamic async check to
 * determine if the provide style is supported
 *
 * @param {AJV} ajv
 * @param {ConfigRepository} configRepository
 */
module.exports.enableDynamicValidationChecks = (ajv, configRepository) => {
  ajv.addKeyword('styleExists', {
    async: true,
    type: 'string',
    validate: checkStyleExists
  });

  async function checkStyleExists(
    schema,
    data,
    parentSchema,
    dataPath,
    parentDataObject
  ) {
    if (parentDataObject.isCustomServiceType) return true;
    const styles = await configRepository.query('styles');
    return !isEmpty(styles.hairStyles.find(style => style.style === data));
  }
};

module.exports.schema = {
  $async: true,
  $id: 'http://bookit.com/schemas/service-schema.json',
  type: 'object',
  required: ['styleId', 'description', 'price'],
  properties: {
    styleId: {
      type: 'string',
      styleExists: {}
    },
    isCustomServiceType: {
      type: 'boolean'
    },
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
