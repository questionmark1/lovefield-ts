/// <reference path="../../typings/tsd.d.ts" />

import {Exception} from '../../lib/base/exception';
import {runTest} from '../run';

describe('Exception Unit Tests:', () => {
  it('should generate expected message', () => {
    var BASE_URL = 'http://sn.im/2a0j3wn?c=';

    var e0 = new Exception(0);
    chai.expect(e0.message).to.equal(BASE_URL + '0');

    var e1 = new Exception(101, 'Album 1');
    chai.expect(e1.message).to.equal(BASE_URL + '101&p0=Album%201');

    var e2 = new Exception(107, 2, 8);
    chai.expect(e2.message).to.equal(BASE_URL + '107&p0=2&p1=8');

    var e3 = new Exception(999, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    chai.expect(e3.message).to.equal(BASE_URL + '999&p0=a&p1=b&p2=c&p3=d');

    var hex = '0123456789abcdef';
    var longString = '';
    var expected = '';
    for (var i = 0; i < 10; i++) {
      if (i < 4) {
        expected += hex;
      }
      longString += hex;
    }

    var e4 = new Exception(999, longString);
    chai.expect(e4.message).to.equal(BASE_URL + '999&p0=' + expected);
  });
  runTest();
});
