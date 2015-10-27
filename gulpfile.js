var fs = require('fs-extra');
var glob = require('glob');
var merge = require('merge-stream');
var nopt = require('nopt');
var path = require('path');

var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var foreach = require('gulp-foreach');
var gulpSequence = require('gulp-sequence');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var tsd = require('gulp-tsd');
var tslint = require('gulp-tslint');
var webserver = require('gulp-webserver');

var log = console.log.bind(console);


function usage() {
  log('Usage:');
  log('  gulp build [--target=lib|tests]');
  log('  gulp clean');
  log('  gulp debug [--port=<number>]');
  log('  gulp lint');
  log('  gulp test [--norebuild]');
}

var knownOpts = {
  'norebuild': Boolean,
  'port': [Number, null],
  'target': [Array, String]
};
var options = nopt(knownOpts);

gulp.task('default', function() {
  usage();
});

gulp.task('clean', function() {
  fs.removeSync('out');
  fs.removeSync('typings');
});

gulp.task('tsd', function(callback) {
  if (options.norebuild) {
    callback();
    return;
  }

  tsd({
    command: 'reinstall',
    config: 'tsd.json'
  }, callback);
});

var tscConfig;
function readCompilerOptions() {
  tscConfig = JSON.parse(fs.readFileSync('tsc.json', 'utf-8')).compilerOptions;
}

gulp.task('combineTypeScript', function(callback) {
  var tsResults =
      gulp.src('lib/**/*.ts')
          .pipe(sourcemaps.init())
          .pipe(ts(tscConfig));

  tsResults.js
      .pipe(concat('lf.js'))
      .pipe(gulp.dest('out/dist'))
      .on('end', function() {
        var distJs = fs.readFileSync('out/dist/lf.js', 'utf-8');
        var files = distJs.split('\n').filter(function(line) {
          return line.indexOf('// FILE: ') != -1;
        }).map(function(line) {
          return line.trim().split(' ').pop();
        });

        var contents = '';
        files.forEach(function(file) {
          var lines = fs.readFileSync(file, 'utf-8').split('\n');
          contents += lines.filter(function(line) {
            return (line.substring(0, 6) != 'import');
          }).join('\n');
        });
        fs.writeFileSync('out/dist/lf.ts', contents);
        fs.unlinkSync('out/dist/lf.js');
        callback();
      });
});

gulp.task('buildDist', ['combineTypeScript'], function() {
  // First to combine TypeScript in correct ordering, and then generate the
  // ES5 JS using babel so that all module references are correct.
  var tsResults =
      gulp.src('out/dist/lf.ts')
          .pipe(sourcemaps.init())
          .pipe(ts(tscConfig));

  return merge([
    tsResults.dts.pipe(gulp.dest('out/dist')),
    tsResults.js
        .pipe(babel({modules: 'amd'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('out/dist'))
  ]);
});

gulp.task('buildLib', function() {
  var tsResults =
      gulp.src('lib/**/*.ts')
          .pipe(sourcemaps.init())
          .pipe(ts(tscConfig));
  return tsResults.js
      .pipe(babel({modules: 'amd'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('out/lib'));
});

gulp.task('buildTests', ['buildDist'], function() {
  var tsResults =
      gulp.src('tests/**/*.ts')
          .pipe(sourcemaps.init())
          .pipe(ts(tscConfig));
  return tsResults.js
      .pipe(babel({modules: 'amd'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('out/tests'));
});

gulp.task('build', ['tsd'], function(callback) {
  if (options.norebuild) {
    callback();
    return;
  }

  var target = options.target;

  readCompilerOptions();
  var validTargets = ['lib', 'dist', 'tests'];
  var targets = validTargets;
  if (target != null) {
    if (typeof(target) == 'string' && validTargets.indexOf(target) != -1) {
      targets = [target];
    } else {
      targets = validTargets.filter(function(item) {
        return target.indexOf(item) != -1;
      });
    }
  }
  var steps = targets.map(function(item) {
    return 'build' + item.substring(0, 1).toUpperCase() + item.substring(1);
  });

  gulpSequence(steps, callback);
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
  var portNumber = options.port || 8000;

  gulp.src('.').pipe(webserver({
    livereload: true,
    directoryListing: true,
    open: false,
    port: portNumber
  }));
});
