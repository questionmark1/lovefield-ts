/// <reference path="../../typings/tsd.d.ts" />

import * as lf from '../../out/dist/lf';
import {runTest} from '../run';

describe('Test default values', () => {
it('Browsers should not complain about default values', () => {
    var clone: any[] = [];
    lf.type.DEFAULT_VALUES.forEach(function(element) {
      clone.push(element);
    });
    chai.expect(clone.length).to.be.gt(0);
    var p = new Promise(function(resolve, reject) {
      resolve();
    });
  });
  runTest();
});
