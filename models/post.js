const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comment");

const postSchema = new Schema({
  title: String,
  description: String,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: ["paranormal", "extraterrestrial", "others"],
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

// Extends the deleteOne method to
// also delete existing comment/s in a post
postSchema.post("deleteOne", { document: true, query: false }, async (doc) => {
  if (doc) {
    await Comment.deleteMany({
      _id: {
        $in: doc.comments,
      },
    });
  }
});

module.exports = mongoose.model("Post", postSchema);
