"use strict";
var sprintf = require("sprintf-js").sprintf;
var moment = require("moment");

module.exports = function(post) {
    var year = moment(post.date).format("YYYY");
    var month = moment(post.date).format("MM");
    var day = moment(post.date).format("DD");
    return sprintf("/blog/%s/%s/%s/%s",
                   year,
                   month,
                   day,
                   post.slug);
};
