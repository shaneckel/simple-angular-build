'use strict';

export default {

  browserPort: 3000,
  UIPort: 3001,

  sourceDir: './app/',
  buildDir: './build/',

  styles: {
    src: 'app/styles/**/*.scss',
    dest: 'build/css',
  },

  scripts: {
    src: 'app/js/**/*.js',
    dest: 'build/js'
  },

  images: {
    src: 'app/images/**/*',
    dest: 'build/images'
  },

  assetExtensions: [
    'js',
    'css',
    'png',
    'jpe?g',
    'gif',
    'svg'
  ],

  views: {
    index: 'app/index.html',
    src: 'app/views/**/*.html',
    dest: 'app/js'
  },

  browserify: {
    bundleName: 'main.js',
    prodSourcemap: false
  },

  init: function() {
    this.views.watch = [
      this.views.index,
      this.views.src
    ];

    return this;
  }

}.init();
