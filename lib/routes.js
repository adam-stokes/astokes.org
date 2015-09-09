"use strict";

import Boom from "boom";
import Posts from "./posts";
import MD from "marked";

let routes = [];

routes.push({
    path: "/",
    method: "GET",
    config: {
        handler: (request, reply) => {
            let context = {
                posts: Posts
            };
            return reply.view("index", context);
        }
    }
});

routes.push({
    path: "/posts/{slug?}",
    method: "GET",
    config: {
        handler: (request, reply) => {
            let post;
            if (request.params.slug) {
                if (Posts[request.params.slug]) {
                    post = Posts[request.params.slug];
                } else {
                    return reply(Boom.notFound());
                }
            } else {
                post = Posts['configuring-imap-with-mutt'];
            }
            let context = {
                posts: Posts,
                title: post.title,
                date: post.date,
                tags: post.tags,
                contents: post.body
            }
            return reply.view("post", context);
        }
    }
});


routes.push({
    path: "/static/{path*}",
    method: "GET",
    config: {
        handler: {
            directory: {
                path: "./public",
                index: false,
                redirectToSlash: false
            }
        }
    }
});

routes.push({
    path: "/favicon.ico",
    method: "GET",
    config: {
        handler: {
            file: "./favicon.ico"
        }
    }
});


export default routes;
