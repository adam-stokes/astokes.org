#!/usr/bin/zsh

LESSC=./node_modules/.bin/lessc
UGLIFY=./node_modules/.bin/uglifyjs
lessItems=(src/styles/*.less)
cssItems=(
    bower_components/bootswatch/paper/bootstrap.min.css
    bower_components/highlightjs/styles/monokai.css
    build/styles/main.css)
jsItems=(
    bower_components/jquery/dist/jquery.js
    bower_components/bootstrap/dist/js/bootstrap.js
    bower_components/flowtype/flowtype.js
    bower_components/highlightjs/highlight.pack.js
    src/js/main.js
)

echo "Prepping build/"
mkdir -p build/{styles,js,fonts,images}

echo "Compiling css"
$LESSC $lessItems --clean-css build/styles/main.css
cat $cssItems > build/styles/main.min.css &

echo "Copying static"
rsync -az src/fonts/* build/fonts/. &
rsync -az src/images/* build/images/. &

echo "Writing javascript files..."
$UGLIFY $jsItems -o build/js/main.min.js
