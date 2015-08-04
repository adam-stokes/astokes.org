"use strict";
var Hapi = require("hapi");
var Good = require("good");
var config = require("./config");
var server = new Hapi.Server();
var Yar = require("yar");
var sprintf = require("sprintf-js").sprintf;
var moment = require("moment");
var Post = require("./models/post");
var mongoose = require("mongoose");
mongoose.connect(sprintf("mongodb://%s/%s", config.db.conn, config.db.name));

server.connection({
    port: config.port
});

var yarOpts = {
    cookieOptions: {
        password: config.secret,
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
        jade: require("jade")
    },
    relativeTo: __dirname,
    path: "./templates",
    context: {
        site: config.info
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
        var ctx = {};
        Post.findByYear(currentYear).sort({date: -1}).execAsync()
            .then(function(posts){
                ctx.posts = posts;
                return;
            }).then(function(){
                return Post.getUniqueYears().then(function(years){
                    ctx.years = years;
                });
            }).then(function(){
                return reply.view("index", ctx);
            }).catch(function(error){
                if (error) {
                    throw Error(error);
                }
            });
    }
});

server.route({
    path: "/blog/{year}/{month}/{day}/{slug}",
    method: "GET",
    handler: function(request, reply) {
        var slug = request.params.slug;
        Post.findOne({"slug": slug}).execAsync()
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
        Post.findByTag(tag).sort({date: -1}).execAsync()
            .then(function(posts){
                var response = reply.view("feed", {posts: posts, updated: posts[0].datexml}, {layout: false});
                response.type("application/xml");
            }).catch(function(error){
                throw Error(error);
            });
    }
});

server.route({
    path: "/sitemap.xml",
    method: "GET",
    handler: function(request, reply) {
        Post.find().sort({date: -1}).execAsync()
            .then(function(posts){
                var response = reply.view("sitemap", {posts: posts}, {layout: false});
                response.type("application/xml");
            });
    }
});

server.route({
    path: "/search",
    method: "POST",
    handler: function(request, reply){
        var searchItem = request.payload.searchInput;
        Post.find({
            $or: [
                {
                    title: new RegExp(searchItem, "i")
                },
                {
                    tags: new RegExp(searchItem, "i")
                }]
        }).sort({date: -1}).execAsync()
            .then(function(posts){
                reply.view("search", {posts: posts, searchInput: searchItem});
            }).catch(function(error){
                if (error){
                    throw Error(error);
                }
            });
    }
});


server.route({
    path: "/archives/{year}",
    method: "GET",
    handler: function(request, reply) {
        var year = moment(request.params.year + "-01-01").toDate();
        var ctx = {};
        Post.findByYear(year).sort({date: -1}).execAsync()
            .then(function(posts){
                ctx.posts = posts;
                return;
            }).then(function(){
                return Post.getUniqueYears().then(function(years){
                    ctx.years = years;
                });
            }).then(function(){
                return reply.view("archives", ctx);
            }).catch(function(err){
                if (err) {
                    throw Error(err);
                }
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
