"use strict";

var Mongoose = require("mongoose");

var postSchema = new Mongoose.Schema({
    title: String,
    slug: String,
    date: {
        type: Date,
        default: Date.now
    },
    tags: String,
    md: String
});

postSchema.statics.getUniqueYears = function (){
    return this.aggregate(
        [
            {$match: {
                "date": {
                    "$gte": new Date("2005-01-01")
                }
            }},
            {$project: {
                "year": {$year: "$date"}
            }},
            {$group: {
                "_id": {
                    "year": "$year"
                }
            }},
            {"$sort": {
                "_id.year": -1
            }}
        ], function(err, results){
            if(err){
                throw Error(err);
            }
            return results;
        });
};

var post = Mongoose.model("post", postSchema);
module.exports = post;
