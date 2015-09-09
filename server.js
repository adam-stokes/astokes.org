"use strict";
import Hapi from "hapi";
import Config from "getconfig";
import Good from "good";
import Jade from "jade";
import Inert from "inert";
import Vision from "vision";
import routes from "./lib/routes";

let serverConfig = {};
let server = new Hapi.Server(serverConfig);

server.connection({
    host: Config.host,
    port: Config.port
});

let plugins = [];
plugins.push({
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
});

plugins.push({
    register: Vision
});

plugins.push({
    register: Inert
});

server.register(plugins, err => {
    if (err) {
        throw err;
    }
});

server.route(routes);

server.views({
    engines: {
        jade: Jade
    },
    relativeTo: __dirname,
    path: "./templates",
    context: {
        site: Config.site
    }
});


export default server;
