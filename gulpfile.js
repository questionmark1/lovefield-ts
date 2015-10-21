var fs = require('fs-extra');
var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var ts = require('gulp-typescript');
var tsd = require('gulp-tsd');
var tslint = require('gulp-tslint');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');
var nopt = require('nopt');
var merge = require('merge-stream');

var log = console.log.bind(console);


function usage() {
  log('Usage:');
  log('  gulp build [--target=lib|tests]');
  log('  gulp clean');
  log('  gulp lint');
  log('  gulp test');
}


gulp.task('default', function() {
  usage();
});


gulp.task('clean', function() {
  fs.removeSync('out');
  fs.removeSync('typings');
});


gulp.task('tsd', function(callback) {
  tsd({
    command: 'reinstall',
    config: 'tsd.json'
  }, callback);
});


var COMPILER_OPTIONS = {
  declaration: true,
  module: 'commonjs',
  noEmitOnError: true,
  //noExternalResolve: true,
  noImplicitAny: true,
  //sortOutput: true,
  target: 'ES5'
};


function buildLib() {
  var tsResults =
      gulp.src('lib/**/*.ts')
          .pipe(sourcemaps.init())
          .pipe(ts(COMPILER_OPTIONS));
  return tsResults.js.pipe(gulp.dest('out/lib'));
}


function buildTests() {
  // Not compiling yet, the definition of lf needs to be wired out correctly
  var tsResults =
      gulp.src('tests/**/*.ts')
          .pipe(sourcemaps.init())
          .pipe(ts(COMPILER_OPTIONS));
  return tsResults.js.pipe(gulp.dest('out/tests'));
}

gulp.task('build', ['tsd'], function() {
  var knownOpts = {
    'target': [Array, String]
  };
  var target = nopt(knownOpts).target;

  var targets = ['lib', 'tests'];
  if (target != null) {
    if (typeof(target) == 'string') {
      targets = [target];
    } else {
      targets = target;
    }
  }

  targets.forEach(function(buildTarget) {
    if (buildTarget == 'lib') {
      return buildLib();
    } else {
      return buildTests();
    }
  });
});


gulp.task('lint', function() {
  // TODO(arthurhsu): integrate with tslint
});
