"use strict";

var s = require("string");
var markdown = require("marked");

module.exports = function(txt){
    txt = s(txt).truncate(600).s;
    return markdown(txt);
};
