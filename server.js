"use strict";
var Promise = require("bluebird");
var Hapi = require("hapi");
var Good = require("good");
var config = require("./config");
var server = new Hapi.Server();
var Yar = require("yar");
var sprintf = require("sprintf-js").sprintf;
var moment = require("moment");
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
    context: {
        site: config,
        archiveYears: Promise.resolve(Post.getUniqueYears()
                                      .then(function(posts){
                                          return posts;
                                      }))
    }
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
    handler: function(request, reply) {
        var currentYear = moment().startOf("year").toDate();
        Post.findByYear(currentYear).sort({date: -1}).exec()
            .then(function(posts){
                return reply.view("index", {posts: posts});
            });
    }
});

server.route({
    path: "/blog/{year}/{month}/{day}/{slug}",
    method: "GET",
    handler: function(request, reply) {
        var slug = request.params.slug;
        Post.findOne({"slug": slug}).exec()
            .then(function(post){
                reply.view("post", {post: post});
            });
    }
});

server.route({
    path: "/feed/{tag}",
    method: "GET",
    handler: function(request, reply) {
        var tag = request.params.tag;
        Post.findByTag(tag).sort({date: -1}).exec()
            .then(function(posts){
                var response = reply.view("feed", {posts: posts, updated: posts[0].date}, {layout: false});
                response.type("application/xml");
            });
    }
});


server.route({
    path: "/archives/{year}",
    method: "GET",
    handler: function(request, reply) {
        var year = moment(request.params.year + "-01-01").toDate();
        Post.findByYear(year).exec()
            .then(function(posts){
                return reply.view("archives", {posts: posts});
            });
    }
});

server.route({
    path: "/static/{path*}",
    method: "GET",
    handler: {
        directory: {
            path: "./public",
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
