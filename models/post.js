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

var post = Mongoose.model("post", postSchema);
module.exports = post;
