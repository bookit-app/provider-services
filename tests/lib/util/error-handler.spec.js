'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');
const {
  handleError,
  ErrorHandler
} = require('../../../src/lib/util/error-handler');

describe('error-handler unit tests', () => {
  it('should respond with the error information', () => {
    const json = stub();
    const res = {
      status: stub().returns({ json: json })
    };

    const error = {
      errorCode: 'TESTerrorCode',
      statusCode: 'TESTstatusCode',
      message: 'TESTmessage'
    };

    handleError(new ErrorHandler(error), res);

    expect(res.status.called).to.be.true;
    expect(res.status.calledWith(error.statusCode)).to.be.true;
    expect(json.called).to.be.true;
    expect(
      json.calledWith({
        errorCode: error.errorCode,
        message: error.message
      })
    ).to.be.true;
  });
});
