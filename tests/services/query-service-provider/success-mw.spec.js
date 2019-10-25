'use strict';

const { stub } = require('sinon');
const { expect } = require('chai');
const mw = require('../../../src/services/query-service-provider/src/success-mw');

describe('query-provider-service success-mw unit tests', () => {
  it('should respond with 404 when no provider details are populated', () => {
    const res = {
      sendStatus: stub()
    };
    const next = stub();

    mw({}, res, next);
    expect(res.sendStatus.called).to.be.true;
    expect(res.sendStatus.calledWith(404)).to.be.true;
  });

  it('should respond with 200 and send the provider when details are populated', () => {
    const statusStub = stub();
    const sendStub = stub();
    statusStub.returns({ send: sendStub });

    const res = {
      status: statusStub,
      provider: {
        id: 'SOMETHIGN'
      }
    };
    const next = stub();

    mw({}, res, next);
    expect(statusStub.called).to.be.true;
    expect(statusStub.calledWith(200)).to.be.true;
    expect(sendStub.called).to.be.true;
    expect(sendStub.calledWith(res.provider)).to.be.true;
  });
});
