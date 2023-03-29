const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Comment schema

const commentSchema = new Schema({
  opinion: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Comment", commentSchema);
