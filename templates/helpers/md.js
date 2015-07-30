"use strict";

var markdown = require("marked");

module.exports = function(md){
    return markdown(md);
};
