# Simple Angular Build

http://simple-angular-build.surge.sh

This is a mash up of starters I've read through-out the internet. Most have a
slant towards whatever the project it was intended for. This is an unbias way to get
started fast. Quick start with an ability to compile and compressed. This is best
suited for one developer just trying to get something done. There's more modular tactics available but this is for speed.

## Requirements

install the dependencies
`npm install`

run gulp
`gulp` or `gulp dev`

## Production for compiling

`gulp prod` 

`cd build`

`nws -p 3000` nws turns a directory into a url for viewing. More here https://github.com/KenPowers/nws

## Structure

### /app
Holds the source files to be compiled. Images, Js, sass, and html templates.

### /app/js/
One file angular application. Can be broken into modules but this works if you're in
hurry and also working for yourself.

### /app/styles/
Break out each partial using `_` and import them into main.scss

### /app/views/
The views are compiled into cached templated views and concatenated into `build/js/main.js` via the `app/js/templates.js`

### /build
Build directory. Depending on whether you've run `gulp` or `gulp prod` this folder will either be compiled or open.
