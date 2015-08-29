"use strict";

import Boom from "boom";
import Post from "./models/post";
import Moment from "moment";

let routes = [];

// routes.push({
//     path: "/",
//     method: "GET",
//     config: {
//         handler: (request, reply) => {
//             var currentYear = Moment()
//                 .startOf("year")
//                 .toDate();
//             var ctx = {};
//             Post.findByYear(currentYear)
//                 .sort({
//                     date: -1
//                 })
//                 .execAsync()
//                 .then(function(posts) {
//                     ctx.posts = posts;
//                     return;
//                 })
//                 .then(function() {
//                     return Post.getUniqueYears()
//                         .then(function(years) {
//                             ctx.years = years;
//                         });
//                 })
//                 .then(function() {
//                     return reply.view("index", ctx);
//                 })
//                 .catch(function(error) {
//                     if (error) {
//                         throw Error(error);
//                     }
//                 });
//         }
//     }
// });

// routes.push({
//     path: "/blog/{year}/{month}/{day}/{slug}",
//     method: "GET",
//     config: {
//         handler: function(request, reply) {
//             var slug = request.params.slug;
//             Post.findOne({
//                 "slug": slug
//             })
//                 .execAsync()
//                 .then(function(post) {
//                     reply.view("post", {
//                         post: post
//                     });
//                 });
//         }
//     }
// });

// routes.push({
//     path: "/feed/{tag}",
//     method: "GET",
//     config: {
//         handler: function(request, reply) {
//             var tag = request.params.tag;
//             Post.findByTag(tag)
//                 .sort({
//                     date: -1
//                 })
//                 .execAsync()
//                 .then(function(posts) {
//                     var response = reply.view("feed", {
//                         posts: posts,
//                         updated: posts[0].datexml
//                     }, {
//                         layout: false
//                     });
//                     response.type("application/xml");
//                 })
//                 .catch(function(error) {
//                     throw Error(error);
//                 });
//         }
//     }
// });

// routes.push({
//     path: "/sitemap.xml",
//     method: "GET",
//     config: {
//         handler: function(request, reply) {
//             Post.find()
//                 .sort({
//                     date: -1
//                 })
//                 .execAsync()
//                 .then(function(posts) {
//                     var response = reply.view("sitemap", {
//                         posts: posts
//                     }, {
//                         layout: false
//                     });
//                     response.type("application/xml");
//                 });
//         }
//     }
// });

// routes.push({
//     path: "/search",
//     method: "POST",
//     config: {
//         handler: function(request, reply) {
//             var searchItem = request.payload.searchInput;
//             Post.find({
//                 $or: [{
//                     title: new RegExp(searchItem, "i")
//                 }, {
//                     tags: new RegExp(searchItem, "i")
//                 }]
//             })
//                 .sort({
//                     date: -1
//                 })
//                 .execAsync()
//                 .then(function(posts) {
//                     reply.view("search", {
//                         posts: posts,
//                         searchInput: searchItem
//                     });
//                 })
//                 .catch(function(error) {
//                     if (error) {
//                         throw Error(error);
//                     }
//                 });
//         }
//     }
// });


// routes.push({
//     path: "/archives/{year}",
//     method: "GET",
//     config: {
//         handler: function(request, reply) {
//             var year = Moment(request.params.year + "-01-01")
//                 .toDate();
//             var ctx = {};
//             Post.findByYear(year)
//                 .sort({
//                     date: -1
//                 })
//                 .execAsync()
//                 .then(function(posts) {
//                     ctx.posts = posts;
//                     return;
//                 })
//                 .then(function() {
//                     return Post.getUniqueYears()
//                         .then(function(years) {
//                             ctx.years = years;
//                         });
//                 })
//                 .then(function() {
//                     return reply.view("archives", ctx);
//                 })
//                 .catch(function(err) {
//                     if (err) {
//                         throw Error(err);
//                     }
//                 });
//         }
//     }
// });

// routes.push({
//     path: "/static/{path*}",
//     method: "GET",
//     config: {
//         handler: {
//             directory: {
//                 path: "./public",
//                 index: false,
//                 redirectToSlash: false
//             }
//         }
//     }
// });

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
