# Simple angular application build

This is a mash up of a collection of different starter files I've read. Most have a
slant towards whatever the project they're working on. This is unbias way to get
started fast. Quick start to get a site compiled and compressed. This is best
suited for one developer just trying to get something done.

Create an html file in the views directory, link to it in the router, watch the changes happen.

## requirements

install the dependencies
`npm install`

run gulp
`gulp` or `gulp dev` or

## Production for compiling
If you want to host on surge run `gulp prod` and send the build folder to surge or whatever
hosting you're currently using.

`gulp prod`

`cd build`

`nws -p 3000`
nws turns a directory into a url for viewing. More here https://github.com/KenPowers/nws

## Structure

### /app
holds the source files to be compiled. Images, Js, sass, and html templates.
### /app/js/
One file angular application. Can be broken into modules but this works if you're in
hurry and working for yourself.
### /app/styles/
break out each partial using `_` and import them into main.scss
### /app/views/
the views are compiled into cached templated views and concatenated into main.js
---
### /build
build directory. depending on whether you've run `gulp` or `gulp prod` this folder will either be compiled or open.
