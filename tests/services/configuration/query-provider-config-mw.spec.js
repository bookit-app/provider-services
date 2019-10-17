'use strict';

const { expect } = require('chai');
const { stub, createStubInstance } = require('sinon');
const { errors } = require('../../../src/lib/constants');
const ConfigRepository = require('../../../src/lib/repository/config-repository');
const repo = createStubInstance(ConfigRepository);
const mw = require('../../../src/services/configuration/src/query-provider-config-mw')(
  repo
);

const req = {
  configQueryOptions: {
    type: 'styles'
  }
};

const sendStub = stub();
const res = {
  status: stub().returns({ send: sendStub })
};
describe('configuration query-provider-config-mw unit tests', () => {
  afterEach(() => {
    repo.query.resetHistory();
    sendStub.resetHistory();
    res.status.resetHistory();
  });

  it('should return the found configuration', async () => {
    const styles = {
      types: [
        {
          name: 'Barber',
          type: 'BARBER'
        },
        {
          type: 'HAIR_DRESSER',
          name: 'Hair Dresser'
        }
      ]
    };

    repo.query.resolves(styles);
    await mw(req, res);

    expect(repo.query.calledWith('styles')).to.be.true;
    expect(res.status.called).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(sendStub.called).to.be.true;
    expect(sendStub.calledWith(styles)).to.be.true;
  });

  it('should raise and error when the repo fails', async () => {
    const next = stub();
    repo.query.rejects(new Error('FORCED-ERROR'));
    await mw(req, res, next);

    expect(repo.query.calledWith('styles'));
    expect(sendStub.called).to.be.false;
    expect(res.status.called).to.be.false;
    expect(next.called).to.be.true;
    const { errorCode, statusCode } = next.args[0][0];
    expect(errorCode).to.equal(errors.systemError.errorCode);
    expect(statusCode).to.equal(errors.systemError.statusCode);
  });
});
