'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const mw = require('../../../src/services/configuration-service/src/param-options-mw');

describe('configuration-service param-options-maw unit tests', () => {
  it('should populate req.configQueryOptions', () => {
    const req = {
      params: {
        config: 'styles'
      }
    };
    const next = stub();

    mw(req, {}, next);
    expect(req.configQueryOptions).to.deep.equal({
      type: 'styles'
    });
    expect(next.called).to.be.true;
  });

  it('should call next with an error if the type provided is invalid', () => {
    const req = {
      params: {
        config: 'something random'
      }
    };
    const next = stub();

    mw(req, {}, next);
    expect(req.configQueryOptions).to.not.exist;
    expect(next.called).to.be.true;
    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.malformedRequest.errorCode);
    expect(statusCode).to.equal(errors.malformedRequest.statusCode);
  });
});
