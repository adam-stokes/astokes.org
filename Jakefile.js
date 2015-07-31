/* global task desc jake complete minify concat */

"use strict";

require("jake-utils");
var log = jake.logger.log;
var exec = jake.exec;

var cssItems = [
    "bower_components/highlightjs/styles/obsidian.css",
    "public/css/main.css"
];

var jsItems = [
    "bower_components/jquery/dist/jquery.js",
    "bower_components/flowtype/flowtype.js",
    "bower_components/highlightjs/highlight.pack.js",
    "assets/js/main.js"
];

task("default", ["prep",
                 "stylus",
                 "concatCSS",
                 "concatJS",
                 "minify",
                 "assets"]);

desc("Clean and prep build dir");
task("prep", function(){
    log("Cleaning public");
    jake.rmRf("public");
    log("Prepping assets dir");
    jake.mkdirP("public/js");
    jake.mkdirP("public/css");
    jake.mkdirP("public/images");
    jake.mkdirP("public/fonts");
});

desc("Copy additional assets");
task("assets", function(){
    jake.cpR("assets/fonts", "public/fonts");
    jake.cpR("assets/images", "public/images");
});

desc("Compile stylus files");
task("stylus", {async: true}, function(){
    log("Running stylus");
    exec(["stylus -u nib -u jeet assets/stylus/main.styl -o public/css"], {printStdout: true}, complete);
});

desc("Minify js");
task("minify", function(){
    log("Minifying");
    minify({
        src: "public/js/main.js",
        dest: "public/js/main.min.js"
    });
});

desc("Concat css");
task("concatCSS", function(){
    log("css");
    concat({
        src: cssItems,
        dest: "public/css/main.min.css"
    });
});

desc("Concat js");
task("concatJS", function() {
    log("js");
    concat({
        src: jsItems,
        dest: "public/js/main.js"
    });
});

desc("lint");
task("lint", { async: true }, function(){
    log("Running eslint");
    exec(["eslint *.js"], {printStdout: true}, complete);
});
