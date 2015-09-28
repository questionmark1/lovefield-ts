var fs = require('fs-extra');
var path = require('path');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsd = require('gulp-tsd');
var tslint = require('gulp-tslint');
var webserver = require('gulp-webserver');
var nopt = require('nopt');
var merge = require('merge-stream');

var log = console.log.bind(console);


function usage() {
  log('Usage:');
  log('  gulp build --target=lib');
  log('  gulp build --target=tests');
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


function getFolders(dir) {
  return fs.readdirSync(dir).filter(function(entry) {
    return fs.statSync(path.join(dir, entry)).isDirectory();
  });
}


gulp.task('build', ['tsd'], function() {
  var knownOpts = {
    'target': ['lib', 'tests']
  };
  var target = nopt(knownOpts).target;
  if (target == null) {
    usage();
    return;
  }

  if (target == 'lib') {
    return gulp.src('lib/**/*.ts').
            pipe(ts({
              noEmitOnError: true,
              noImplicitAny: true,
              out: 'lovefield.js'
            })).js.pipe(gulp.dest('out'));
  } else {
    // Not compiling yet, the definition of lf needs to be wired out correctly
//    var tests = getFolders('tests');
//    console.log(tests);
//    var tasks = tests.map(function(folder) {
//      return gulp.src([
//        'lib/**/*.ts',
//        'tests/' + folder + '/**/*.ts'
//      ]).pipe(ts({
//        noEmitOnError: true,
//        noImplicitAny: true,
//        out: folder + '_test.js'
//      })).js.pipe(gulp.dest('out/' + folder));
//    });

//    return merge(tasks);
  }
});


gulp.task('lint', function() {
  // TODO(arthurhsu): integrate with tslint
});
