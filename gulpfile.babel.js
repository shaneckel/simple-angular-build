'use strict';

// check out Jake Marsh's starter here for a more detailed and modular version:
// https://github.com/jakemmarsh/angularjs-gulp-browserify-boilerplate

global.isProd = false;

import config         from './gulpconfig';

import autoprefixer   from 'gulp-autoprefixer';
import babelify       from 'babelify';
import browserify     from 'browserify';
import browserSync    from 'browser-sync';
import buffer         from 'vinyl-buffer';
import changed        from 'gulp-changed';
import debowerify     from 'debowerify';
import del            from 'del';
import gulp           from 'gulp';
import gulpif         from 'gulp-if';
import gutil          from 'gulp-util';
import imagemin       from 'gulp-imagemin';
import jshint         from 'gulp-jshint';
import ngAnnotate     from 'browserify-ngannotate';
import notify         from 'gulp-notify';
import prettyHrtime   from 'pretty-hrtime';
import runSequence    from 'run-sequence';
import sass           from 'gulp-sass';
import source         from 'vinyl-source-stream';
import sourcemaps     from 'gulp-sourcemaps';
import streamify      from 'gulp-streamify';
import templateCache  from 'gulp-angular-templatecache';
import uglify         from 'gulp-uglify';
import url            from 'url';
import watchify       from 'watchify';


// dev watch

gulp.task('default', ['dev']); // "gulp"

gulp.task('dev', function() {
  global.isProd = false;
  runSequence(['clean', 'styles', 'images', 'views', 'browserify'], 'watch');
});


// production compile

gulp.task('prod', function() {
  global.isProd = true;
  runSequence( ['clean', 'styles', 'images', 'views', 'browserify']);
});


// clean directory

gulp.task('clean', function() {
  del([config.buildDir]);
});


// watch for changes

gulp.task('watch', ['browserSync'], function() {
  gulp.watch(config.scripts.src, ['lint']);
  gulp.watch(config.styles.src,  ['styles']);
  gulp.watch(config.images.src,  ['images']);
  gulp.watch(config.views.watch, ['views']);
});


// view compiling

gulp.task('views', function() {
  gulp.src(config.views.index)
    .pipe(gulp.dest(config.buildDir));
  return gulp.src(config.views.src)
    .pipe(templateCache({
      standalone: true
    }))
    .pipe(gulp.dest(config.views.dest))
    .pipe(browserSync.stream({ once: true }));
});


// css compiling

gulp.task('styles', function () {
  const createSourcemap = !global.isProd || config.styles.prodSourcemap;
  return gulp.src(config.styles.src)
    .pipe(gulpif(createSourcemap, sourcemaps.init()))
    .pipe(sass({
      sourceComments: !global.isProd,
      outputStyle: global.isProd ? 'compressed' : 'nested',
      includePaths: config.styles.sassIncludePaths
    }))
    .on('error', handleErrors)
    .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
    .pipe(gulpif(
      createSourcemap,
      sourcemaps.write( global.isProd ? './' : null ))
    )
    .pipe(gulp.dest(config.styles.dest))
    .pipe(browserSync.stream({ once: true }));
});


// javascript linting

gulp.task('lint', function() {
  return gulp.src([config.scripts.src, '!app/js/templates.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


// image compiling

gulp.task('images', function() {
  return gulp.src(config.images.src)
    .pipe(changed(config.images.dest)) // Ignore unchanged files
    .pipe(gulpif(global.isProd, imagemin())) // Optimize
    .pipe(gulp.dest(config.images.dest))
    .pipe(browserSync.stream({ once: true }));
});


// sync changes to your browser

gulp.task('browserSync', function() {
  const DEFAULT_FILE = 'index.html';
  const ASSET_EXTENSION_REGEX = new RegExp(`\\b(?!\\?)\\.(${config.assetExtensions.join('|')})\\b(?!\\.)`, 'i');
  browserSync.init({
    server: {
      baseDir: config.buildDir,
      middleware: function(req, res, next) {
        var fileHref = url.parse(req.url).href;
        if ( !ASSET_EXTENSION_REGEX.test(fileHref) ) {
          req.url = '/' + DEFAULT_FILE;
        }
        return next();
      }
    },
  	port: config.browserPort,
  	ui: {
    	port: config.UIPort
    },
    ghostMode: {
      links: false
    }
  });
});


// javascript compiling

function buildScript(file) {
  var bundler = browserify({
    entries: [config.sourceDir + 'js/' + file],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: !global.isProd
  });
  if ( !global.isProd ) {
    bundler = watchify(bundler);
    bundler.on('update', function() {
      rebundle();
      gutil.log('Rebundle...');
    });
  }
  const transforms = [
    { 'name':babelify, 'options': {}},
    { 'name':debowerify, 'options': {}},
    { 'name':ngAnnotate, 'options': {}},
    { 'name':'brfs', 'options': {}},
    { 'name':'bulkify', 'options': {}}
  ];
  transforms.forEach(function(transform) {
    bundler.transform(transform.name, transform.options);
  });
  function rebundle() {
    const stream = bundler.bundle();
    const createSourcemap = global.isProd && config.browserify.prodSourcemap;
    return stream.on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulpif(createSourcemap, buffer()))
      .pipe(gulpif(createSourcemap, sourcemaps.init()))
      .pipe(gulpif(global.isProd, streamify(uglify({
        mangle: false,
        compress: { drop_console: true }
      }))))
      .pipe(gulpif(createSourcemap, sourcemaps.write('./')))
      .pipe(gulp.dest(config.scripts.dest))
      .pipe(browserSync.stream({ once: true }));
  }
  return rebundle();
}

gulp.task('browserify', function() {
  return buildScript('main.js');
});


// Error Handling

function handleErrors(error) {
  if( !global.isProd ) {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
      title: 'Compile Error',
      message: '<%= error.message %>'
    }).apply(this, args);
    this.emit('end');

  } else {
    console.log(error);
    process.exit(1);
  }
};
