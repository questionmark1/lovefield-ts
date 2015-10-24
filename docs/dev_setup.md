Lovefield-ts is TypeScript port of Lovefield. The basic set up is:

* Compile to ES6
* Transpile ES6 to ES5 using Babel
* Use core-js shim to polyfill for browsers that does not support ES6
  collections.

The reason to use core-js shim is that it has best implementation of ES6
features that we use: Promise, Map, and Set.
https://kangax.github.io/compat-table/es6/

The reason to use Babel instead of directly let TypeScript use core-js is
because the TypeScript definition of core-js is off and causing compilation
issues.

For test we run Mocha in BDD way so that you can fire up a browser to debug.
The automated test currently use PhantomJS, but will be configurable later
so that browser-dependent tests can be run on browsers.
(Note: the build bots will not run PhantomJS, all bots are supposed to run
 on real browsers.)
