'use strict';

const { expect } = require('chai');
const { stub, createStubInstance } = require('sinon');
const Firestore = require('@google-cloud/firestore');
const ConfigRepository = require('../../../src/lib/repository/config-repository');

describe('config-repository unit tests', () => {
  let repo, firestore;

  before(() => {
    firestore = createStubInstance(Firestore);
    repo = new ConfigRepository(firestore);
  });

  it('should return the document requested', () => {
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

    const snapshot = {
      exists: true,
      data: () => styles
    };

    const getStub = stub().resolves(snapshot);
    const collectionStub = {
      doc: stub().returns({
        get: getStub
      })
    };
    firestore.collection.returns(collectionStub);

    expect(repo.query('styles')).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal(styles);
    });
  });

  it('should return {} when the document requested does not exist', () => {
    const snapshot = {
      exists: false
    };

    const getStub = stub().resolves(snapshot);
    const collectionStub = {
      doc: stub().returns({
        get: getStub
      })
    };
    firestore.collection.returns(collectionStub);

    expect(repo.query('styles')).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal({});
    });
  });
});
