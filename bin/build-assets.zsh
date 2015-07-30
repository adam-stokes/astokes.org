#!/usr/bin/zsh

LESSC=./node_modules/.bin/lessc
UGLIFY=./node_modules/.bin/uglifyjs
lessItems=(less/*.less)
cssItems=(
    bower_components/bootswatch/united/bootstrap.min.css
    bower_components/highlightjs/styles/monokai.css
    static/css/main.css)
jsItems=(
    bower_components/jquery/dist/jquery.js
    bower_components/bootstrap/dist/js/bootstrap.js
    bower_components/flowtype/flowtype.js
    bower_components/highlightjs/highlight.pack.js
    static/js/main.js
)

echo "Compiling css"
$LESSC $lessItems --clean-css static/css/main.css
cat $cssItems > static/css/main.min.css &

echo "Writing javascript files..."
$UGLIFY $jsItems -o static/js/main.min.js
