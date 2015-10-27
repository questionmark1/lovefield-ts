/// <reference path="../../typings/tsd.d.ts" />

import * as lf from '../../out/dist/lf';
import {runTest} from '../run';

describe('Suite base/row:', () => {
  it('should create row', () => {
    var row1 = lf.Row.create();
    var row2 = lf.Row.create();
    chai.expect(row1.id()).be.lt(row2.id());
  });

  it('should honor assigned id', () => {
    var id = 10;
    var row = new lf.Row(id, {});
    chai.expect(row.id()).to.equal(id);
  });

  it('should store assigned payload', () => {
    var payload = { 'fieldA': 'valueA' };
    var row = lf.Row.create(payload);
    chai.expect(row.payload()).to.equal(payload);
  });

  it('should convert hex correctly', () => {
    var buffer = new ArrayBuffer(24);
    var uint8Array = new Uint8Array(buffer);
    for (var i = 0; i < 24; i++) {
      uint8Array[i] = i;
    }

    var expected = '000102030405060708090a0b0c0d0e0f1011121314151617';
    chai.expect(lf.Row.hexToBin('')).to.be.null;
    chai.expect(lf.Row.hexToBin(null)).to.be.null;
    chai.expect(lf.Row.binToHex(buffer)).to.equal(expected);
    chai.expect(lf.Row.binToHex(lf.Row.hexToBin(expected))).to.equal(expected);
  });

  runTest();
});
