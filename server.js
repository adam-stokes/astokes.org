"use strict";
var Hapi = require("hapi");
var Good = require("good");
var config = require("./config");
var server = new Hapi.Server();
var Yar = require("yar");
var sprintf = require("sprintf-js").sprintf;
var Post = require("./models/post");
var mongoose = require("mongoose");
mongoose.connect(sprintf("mongodb://10.0.3.151/astokes"));

server.connection({
    port: 8080
});

var yarOpts = {
    cookieOptions: {
        password: "p00b34r",
        clearInvalid: true,
        isSecure: false
    }
};

server.register({
    register: Yar,
    options: yarOpts
}, function(err) {
    if (err) {
        throw Error(err);
    }
});

server.views({
    engines: {
        hbs: require("handlebars")
    },
    relativeTo: __dirname,
    path: "./templates",
    layoutPath: "./templates/layout",
    layout: "default",
    helpersPath: "./templates/helpers",
    partialsPath: "./templates/partials",
    context: config
});

server.route({
    path: "/favicon.ico",
    method: "GET",
    handler: {
        file: "./favicon.ico"
    }
});

server.route({
    path: "/",
    method: "GET",
    handler: function(req, resp) {
        Post.find().limit(10).sort({date: -1}).exec()
            .then(function(posts){
                resp.view("index",
                          {posts: posts});
            });
    }
});

server.route({
    path: "/blog/{year}/{month}/{day}/{slug}",
    method: "GET",
    handler: function(req, resp) {
        var slug = req.params.slug;
        Post.findOne({"slug": slug}).exec()
            .then(function(post){
                resp.view("post", {post: post});
            });
    }
});

server.route({
    path: "/static/{path*}",
    method: "GET",
    handler: {
        directory: {
            path: "./static",
            listing: false,
            index: false
        }
    }
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require("good-console"),
            events: {
                response: "*",
                log: "*"
            }
        }]
    }
}, function(err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function() {
        server.log("info", "Server running at: " + server.info.uri);
    });
});
