"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var cssmin = require("gulp-cssmin");
var neat = require("node-neat").includePaths;

var paths = {
    scss: "scss/*.scss"
};

gulp.task("styles", function(){
    return gulp.src(paths.scss)
        .pipe(sass({
            includePaths: ["styles"].concat(neat),
            outputStyle: "compressed"
        }))
        .pipe(gulp.dest("./static/css"));
});

var cssItems = [
    "bower_components/highlightjs/styles/monokai.css",
    "static/css/main.css"
];

var jsItems = [
    "bower_components/jquery/dist/jquery.js",
    "bower_components/flowtype/flowtype.js",
    "bower_components/highlightjs/highlight.pack.js",
    "static/js/main.js"
];

gulp.task("concat", function(){
    gulp.src(cssItems)
        .pipe(concat("main.min.css"))
        .pipe(gulp.dest("static/css"));
    gulp.src(jsItems)
        .pipe(uglify())
        .pipe(concat("main.min.js"))
        .pipe(gulp.dest("static/js"));
});

gulp.task("default", ["styles", "concat"]);
