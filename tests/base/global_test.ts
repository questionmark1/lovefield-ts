/// <reference path="../../typings/tsd.d.ts" />

import * as lf from '../../out/dist/lf';
import {runTest} from '../run';

describe('Suite base/global:', () => {
  var global: lf.Global;

  before(() => {
    global = lf.Global.get();
  });

  afterEach(() => {
    global.clear();
  });

  it('should return same Global object for Global#get', () => {
    chai.expect(lf.Global.get()).to.equal(global);
  });

  it('should return the service registered', () => {
    var bar: Object = {};
    global.registerService('foo', bar);
    chai.expect(global.isRegistered('foo')).to.be.true;
    chai.expect(global.getService('foo')).to.equal(bar);
  });

  it('should throw if the Global#get on unregistered service', () => {
    chai.expect(global.isRegistered('cache')).to.be.false;
    var expectedError = new lf.Exception(7, 'cache');
    chai.expect(global.getService.bind('cache')).to.throw(expectedError);
  });

  it('should remove all registered service after Global#clear', () => {
    var bar: Object = {};
    global.registerService('foo', bar);
    chai.expect(global.isRegistered('foo')).to.be.true;
    global.clear();
    chai.expect(global.isRegistered('foo')).to.be.false;
  });

  runTest();
});
