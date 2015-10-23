/// <reference path="../typings/tsd.d.ts" />

export function runTest() {
  if (window.mochaPhantomJS) {
    mochaPhantomJS.run();
  } else {
    mocha.run();
  }
}
