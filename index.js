"use strict";
require("babel/register");

var server = require("./server");
server.start(function(){
    console.info("Server running at: %s", server.info.uri);
});
