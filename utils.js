"use strict";

var fs = require("mz/fs");
var join = require("path").join;
var fm = require("fastmatter");
var _ = require("lodash");
var markdown = require("marked");

function parseFM(path){
    return fs.readFile(path, "utf8")
        .then(function(post){
            var matter = fm(post.toString());
            var meta = {
                html: markdown(matter.body),
                body: matter.body
            };
            return _.merge(meta, matter.attributes);
        });
}
module.exports.parseFM = parseFM;

module.exports.collection = function(source){
    return fs.readdir(source).map(function(file){
        return parseFM(join(source, file));
    });
};
