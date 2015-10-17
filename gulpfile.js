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


var COMPILER_OPTIONS = {
  declaration: true,
  module: 'commonjs',
  noEmitOnError: true,
  noExternalResolve: true,
  noImplicitAny: true,
  sortOutput: true  
};


function buildLib() {
  var tsResults =
      gulp.src('lib/**/*.ts')
          .pipe(sourcemaps.init())
          .pipe(ts(COMPILER_OPTIONS));
  return merge([
    tsResults.dts.pipe(gulp.dest('out/definitions')),
    tsResults.js
        .pipe(concat('lf.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('out/js'))    
  ]);
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
    return buildLib();
  }
//   if (target == 'lib') {
//     return gulp.src('lib/**/*.ts').
//             pipe(ts({
//               module: 'commonjs',
//               noEmitOnError: true,
//               noImplicitAny: true,
//               out: 'lf.js'
//             })).js.pipe(gulp.dest('out'));
//   } else {
//     // Not compiling yet, the definition of lf needs to be wired out correctly
//     var tests = getFolders('tests');
//     console.log(tests);
//     var tasks = tests.map(function(folder) {
//       return gulp.src([
//         'lib/**/*.ts',
//         'tests/' + folder + '/**/*.ts'
//       ]).pipe(ts({
//         noEmitOnError: true,
//         noImplicitAny: true,
//         out: folder + '_test.js'
//       })).js.pipe(gulp.dest('out/' + folder));
//     });
// 
//     return merge(tasks);
//   }
});


gulp.task('lint', function() {
  // TODO(arthurhsu): integrate with tslint
});
