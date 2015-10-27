var fs = require('fs-extra');
var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var ts = require('gulp-typescript');
var tsd = require('gulp-tsd');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');
var nopt = require('nopt');
var merge = require('merge-stream');
var glob = require('glob');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var foreach = require('gulp-foreach');
var tslint = require('gulp-tslint');
var babel = require('gulp-babel');

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

var tscConfig;
function readCompilerOptions() {
  tscConfig = JSON.parse(fs.readFileSync('tsc.json', 'utf-8')).compilerOptions;
}

function combineTs(files) {
  // The import statements must be stripped out from combined TS to avoid
  // errors.
  var contents = '';
  files.forEach(function(file) {
    var lines = fs.readFileSync(file, 'utf-8').split('\n');
    contents += lines.filter(function(line) {
      return (line.substring(0, 6) != 'import');
    }).join('\n');
  });
  return contents;
}

function buildDist() {
  log('Building dist ...');
  var tsResults =
      gulp.src('lib/**/*.ts')
          .pipe(sourcemaps.init())
          .pipe(ts(tscConfig));

  return merge([
    tsResults.dts
        .pipe(concat('lf.d.ts'))
        .pipe(gulp.dest('out/dist')),
    tsResults.js
        .pipe(babel({modules: 'amd'}))
        .pipe(concat('lf.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('out/dist'))
        .on('end', function() {
          var distJs = fs.readFileSync('out/dist/lf.js', 'utf-8');
          var files = distJs.split('\n').filter(function(line) {
            return line.indexOf('// FILE: ') != -1;
          }).map(function(line) {
            return line.trim().split(' ').pop();
          });
          fs.writeFileSync('out/dist/lf.ts', combineTs(files));
        })
  ]);
}

function buildLib() {
  log('Building lib ...');
  var tsResults =
      gulp.src('lib/**/*.ts')
          .pipe(sourcemaps.init())
          .pipe(ts(tscConfig));
  return tsResults.js
      .pipe(babel({modules: 'amd'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('out/lib'));
}

function buildTests() {
  log('Buiding tests ...');
  // Not compiling yet, the definition of lf needs to be wired out correctly
  var tsResults =
      gulp.src('tests/**/*.ts')
          .pipe(sourcemaps.init())
          .pipe(ts(tscConfig));
  return tsResults.js
      .pipe(babel({modules: 'amd'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('out/tests'));
}

gulp.task('build', ['tsd'], function() {
  readCompilerOptions();
  var knownOpts = {
    'target': [Array, String]
  };
  var target = nopt(knownOpts).target;

  var targets = ['dist', 'lib', 'tests'];
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
    } else if (buildTarget == 'dist') {
      return buildDist();
    } else {
      return buildTests();
    }
  });
});

function createTestEnv() {
  var files = glob.sync('tests/**/*_test.ts');
  var template = fs.readFileSync('tests/mocha.html.template', 'utf-8');
  files.forEach(function(filePath) {
    var scriptName = path.basename(filePath, '.ts');
    var outputPath = path.join(
      'out', path.dirname(filePath), scriptName + '.html');
    var contents = template.replace('{{script}}', scriptName + '.js');
    fs.writeFileSync(outputPath, contents);

    var jsScript = path.join('out', path.dirname(filePath), scriptName + '.js');
    var jsContents = fs.readFileSync(jsScript, 'utf-8');
    var newContents =
        jsContents.replace('\'../../out/dist/lf\'', '\'../../../out/dist/lf\'');
    if (newContents != jsContents) {
      fs.writeFileSync(jsScript, newContents);
    }
  });
}

gulp.task('test', ['build'], function() {
  createTestEnv();
  return gulp.src('out/tests/**/*_test.html')
      .pipe(foreach(function(stream, file) {
        log('[INFO] Testing', path.relative(__dirname, file.path));
        return stream.pipe(mochaPhantomJS({reporter: 'tap'}));
      }));
});

gulp.task('lint', function() {
  var lintOptions = fs.readFileSync('tslint.json', 'utf-8');
  return gulp.src(['lib/**/*.ts', 'tests/**/*.ts'])
      .pipe(foreach(function(stream, file) {
        return stream.pipe(tslint(lintOptions)).pipe(tslint.report('full'));
      }));
});

gulp.task('debug', function() {
  createTestEnv();
  var knownOps = {
    'port': [Number, null]
  };
  var portNumber = nopt(knownOps).port || 8000;

  gulp.src('.').pipe(webserver({
    livereload: true,
    directoryListing: true,
    open: false,
    port: portNumber
  }));
});
