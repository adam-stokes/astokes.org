"use strict";

import gulp from "gulp";
import eslint from "gulp-eslint";
import uglify from "gulp-uglify";
import minifycss from "gulp-minify-css";
import concat from "gulp-concat";
import del from "del";
import postcss from "gulp-postcss";
import precss from "precss";
import cssnext from "cssnext";
import cssnano from "cssnano";
import rucksack from "gulp-rucksack";

let css = [
    "bower_components/normalize-css/normalize.css",
    "bower_components/highlightjs/styles/obsidian.css",
    "assets/css/*"
];

gulp.task('styles', () => {
    return gulp.src(css)
        .pipe(postcss([
            precss(),
            cssnext(),
            cssnano()]))
        .pipe(rucksack())
        .pipe(minifycss())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('public/css'));
});

let js = [
    "bower_components/jquery/dist/jquery.js",
    "bower_components/highlightjs/highlight.pack.js",
    "assets/js/main.js"
];

gulp.task('js', () => {
    return gulp.src(js)
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('public/js'))
});

gulp.task('lint', () => {
    return gulp.src(['lib/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
});

gulp.task('clean', (cb) =>{
    del(['public'], cb);
});

gulp.task('default', ['clean', 'lint', 'styles', 'js']);
