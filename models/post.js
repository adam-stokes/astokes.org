"use strict";

var Promise = require("bluebird");
var Mongoose = require("mongoose");
Promise.promisifyAll(Mongoose);
var moment = require("moment");
var markdown = require("marked");
var sprintf = require("sprintf-js")
  .sprintf;

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

postSchema.statics.getUniqueYears = function() {
  return this.aggregateAsync(
    [{
      $match: {
        "date": {
          "$gte": new Date("2005-01-01")
        }
      }
    }, {
      $project: {
        "year": {
          $year: "$date"
        }
      }
    }, {
      $group: {
        "_id": {
          "year": "$year"
        }
      }
    }, {
      "$sort": {
        "_id.year": -1
      }
    }]);
};

postSchema.statics.findByYear = function(year) {
  var currentYear = year;
  var nextYear = moment(currentYear)
    .add(1, "years")
    .toDate();
  console.log("Current: %s, Next: %s", currentYear, nextYear);
  return this.find({
    date: {
      $gte: currentYear,
      $lt: nextYear
    }
  });
};

postSchema.statics.findByTag = function(name) {
  return this.find({
    tags: new RegExp(name, "i")
  });
};

postSchema.virtual("path")
  .get(function() {
    var year = moment(this.date)
      .format("YYYY");
    var month = moment(this.date)
      .format("MM");
    var day = moment(this.date)
      .format("DD");
    return sprintf("/blog/%s/%s/%s/%s",
      year,
      month,
      day,
      this.slug);
  });

postSchema.virtual("html")
  .get(function() {
    return markdown(this.md);
  });

postSchema.virtual("datehumanize")
  .get(function() {
    return moment(this.date)
      .format("MMMM Do YYYY, h:mm a");
  });

postSchema.virtual("datexml")
  .get(function() {
    return moment(this.date)
      .format("ddd, DD MMM YYYY HH:mm:ss ZZ");
  });

var post = Mongoose.model("post", postSchema);
module.exports = post;
