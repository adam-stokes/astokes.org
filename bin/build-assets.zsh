#!/usr/bin/zsh

UGLIFY=./node_modules/.bin/uglifyjs
cssItems=(
    bower_components/highlightjs/styles/monokai.css
    static/css/main.css)
jsItems=(
    bower_components/jquery/dist/jquery.js
    bower_components/flowtype/flowtype.js
    bower_components/highlightjs/highlight.pack.js
    static/js/main.js
)

gulp
cat $cssItems > static/css/main.min.css &

echo "Writing javascript files..."
$UGLIFY $jsItems -o static/js/main.min.js
