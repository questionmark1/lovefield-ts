/// <reference path="../../typings/tsd.d.ts" />

import * as lf from '../../out/dist/lf';
import {runTest} from '../run';

describe('Suite base/enums:', () => {
  it('should not throw by enumerating default values', () => {
    var clone: any[] = [];
    lf.type.DEFAULT_VALUES.forEach(function(element: any) {
      clone.push(element);
    });
    chai.expect(clone.length).to.be.gt(0);
  });

  runTest();
});
