"use strict";

import fs from "mz/fs";
import {join} from "path";
import fm from "fastmatter";
import _ from "lodash";
import markdown from "marked";

function parseFM(path){
    return fs.readFile(path, "utf8")
        .then(function(post){
            let matter = fm(post.toString());
            let meta = {
                html: markdown(matter.body),
                body: matter.body
            };
            return _.merge(meta, matter.attributes);
        });
}
module.exports.parseFM = parseFM;

module.exports.collection = source => {
    return fs.readdir(source).map(function(file){
        return parseFM(join(source, file));
    });
};
