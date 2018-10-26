const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

var router = express.Router();


// Routes

// A GET route for scraping the subreddit programmerhumor website
router.get("/scrape", function(req, res) {

  // First, we grab the body of the html with axios
  axios.get("https://old.reddit.com/r/ProgrammerHumor").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);


    // An empty array to save the data that we'll scrape
    const results = [];

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("p.title").each(function(i, element) {

      // Save the text of the element in a "title" variable
      const title = $(element).text;

      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      const link = $(element).attr('href');

      const tagline = $('.tagline').text;

      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        tagline: tagline,
        link: link
      });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);

      // Create a new Post using the `result` object built from scraping
      db.Post.create(results)
        .then(function(dbPost) {
          // View the added result in the console
          console.log(dbPost);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });

    // If we were able to successfully scrape and save a Post, send a message to the client
    res.send("Scrape Complete");
  });

// Route for getting all posts from the db
router.get("/posts", function(req, res) {
  // Grab every document in the posts collection
  db.Post.find({})
    .then(function(dbPost) {
      //send posts back to client
       res.json(dbPost);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific post by id, populate it with it's comment
router.get("/posts/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Post.findOne({ _id: req.params.id })
  // ..and populate all of the comments associated with it
    .populate("comment")
    .then(function(dbPost) {
      // If we were able to successfully find an Post with the given id, send it back to the client
      res.json(dbPost);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating comments on a post
router.post("/posts/:id", function(req, res) {
  // Create a new comment and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {

      return dbComment.findOneAndUpdate({ _id: req.params.id }, { comment: db.Comment._id }, { new: true });
    })
    .then(function(dbPost) {
      res.json(dbPost);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

module.exports = router;
