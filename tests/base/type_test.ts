/// <reference path="../../typings/tsd.d.ts" />

import * as lf from '../../out/dist/lf';
import {runTest} from '../run';

describe('Test default values', () => {
  it('Browsers should not complain about default values', () => {
    var clone = Object.keys(lf.Type).map(function(type) {
      return lf.type.DEFAULT_VALUES[type];
    });
    chai.expect(clone.length).to.be.gt(0);
  });
  runTest();
});
