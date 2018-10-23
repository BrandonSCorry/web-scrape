const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  //tagline
  tagline: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  //img
  thumbnail: {
    type: String,
    required: true
  },
  // `comment` is an object that stores a comment id
  // The ref property links the ObjectId to the comment model
  // This allows us to populate the post with an associated comment
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// This creates our model from the above schema, using mongoose's model method
const Post = mongoose.model("Post", PostSchema);

// Export the post model
module.exports = Post;
