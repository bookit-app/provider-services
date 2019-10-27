'use strict';

const { expect } = require('chai');
const { stub } = require('sinon');

const mw = require('../../../src/lib/mw/convert-pubsub-message-mw');

describe('offering-notification-processor convert-pubsub-message-mw unit tests', () => {
  it('should convert the body from base64 to a JS object', () => {
    const req = {
      body: {
        message: {
          data: 'eyJ0ZXN0IjogIkhlbGxvIn0='
        }
      }
    };

    const next = stub();

    mw(req, {}, next);

    expect(next.called).to.be.true;
    expect(req.body).to.deep.equal({
      test: 'Hello'
    });
  });
});
