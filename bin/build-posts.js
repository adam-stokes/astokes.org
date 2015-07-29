#!/usr/bin/env node
"use strict";
var promise = require("bluebird");
var _ = require("lodash");
var fs = require("mz/fs");
var isFile = require("is-file-promise");
var parse = require("genc-parse");
var mkdirp = require("mkdirp-promise");
var toml = promise.promisifyAll(require("toml"));
var expandHome = require("expand-tilde");
var jade = require("jade");
var co = require("co");
var Log = require("log");
var log = new Log();

function saveSingle(config, posts){
    _.each(posts, function (post){
        var template = jade.compileFile("templates/" + post.template);
        mkdirp("build/" + post.permalink)
            .then(function() {
                return fs.writeFile("build/" + post.permalink + "/index.html", template(_.merge(config, post)));
            });
    });
    return promise.all(posts);
}

function saveCollection(config, posts, templateFile, dst){
    return mkdirp("build")
        .then(function() {
            var template = jade.compileFile("templates/" + templateFile);
            return fs.writeFile(dst, template(_.merge(config, {posts: posts})));
        });
}

co(function*(){
    if (!(yield isFile("./config.toml"))){
        throw Error("Unable to find config.toml.");
    }
    log.info("Parsing config file");
    var confFile = yield fs.readFile("./config.toml");
    var config = yield toml.parse(confFile);
    log.info("Reading posts");
    var posts = yield parse(expandHome(config.blogPosts));
    log.info("Writing individual posts");
    yield saveSingle(config, posts);

    log.info("Writing index");
    yield saveCollection(config, posts, "index.jade", "build/index.html");
    log.info("Writing feed");
    yield saveCollection(config, posts, "feed.jade", "build/feed.xml");
    log.info("Writing sitemap");
    yield saveCollection(config, posts, "sitemap.jade", "build/sitemap.xml");
    return;
}).catch(function(err){
    throw Error(err);
});


