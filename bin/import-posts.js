#!/usr/bin/env node
"use strict";
var Promise = require("bluebird");
var join = Promise.join;
var utils = require("../utils");
var Post = require("../models/post");
var expandHome = require("expand-tilde");
var mongoose = require("mongoose");

mongoose.connect("mongodb://10.0.3.151/astokes");

utils.collection(expandHome("~/Dropbox/Articles"))
    .map(function(post){
        var model = new Post();
        model.title = post.title;
        model.date = post.date;
        model.tags = post.tags;
        model.md = post.body;
        return join(model, function(model){
            return model.save();
        });
    }).each(function(model){
        console.log("Finished: %s", model.title);
    }).then(function(){
        console.log("All done.");
        return mongoose.disconnect();
    }).catch(function(err){
        throw Error(err);
    });


