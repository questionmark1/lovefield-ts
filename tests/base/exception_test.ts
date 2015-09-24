import {Exception} from 'lf';
import {expect} from 'chai';

describe('Exception Unit Tests:', () => {
  it('should generate expected message', () => {
    var BASE_URL = 'http://sn.im/2a0j3wn?c=';

    var e0 = new lf.Exception(0);
    expect(e0.message).to.equal(BASE_URL + '0');

    var e1 = new lf.Exception(101, 'Album 1');
    expect(e1.message).to.equal(BASE_URL + '101&p0=Album%201');

    var e2 = new lf.Exception(107, 2, 8);
    expect(e2.message).to.equal(BASE_URL + '107&p0=2&p1=8');

    var e3 = new lf.Exception(999, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    expect(e3.message).to.equal(BASE_URL + '999&p0=a&p1=b&p2=c&p3=d');

    var hex = '0123456789abcdef';
    var longString = '';
    var expected = '';
    for (var i = 0; i < 10; i++) {
      if (i < 4) {
        expected += hex;
      }
      longString += hex;
    }

    var e4 = new lf.Exception(999, longString);
    expect(e4.message).to.equal(BASE_URL + '999&p0=' + expected);
  });
});
