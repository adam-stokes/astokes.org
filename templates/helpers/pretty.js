"use strict";

var moment = require("moment");

module.exports = function(dateTxt){
    return moment(dateTxt).format("MMMM Do YYYY, h:mm a");
};
