const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comment");

// Report image schema

const imageSchema = new Schema({
  url: String,
  filename: String,
});

// Report image virtual

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_650,h_350,c_fit");
});

// Report Schema

const reportSchema = new Schema({
  title: String,
  description: String,
  images: [imageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: ["Paranormal", "UFO/Aliens", "Others"],
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

// Extends the findOneAndDelete method to
// also delete existing comment/s in a report

reportSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Comment.deleteMany({
      _id: {
        $in: doc.comments,
      },
    });
  }
});

module.exports = mongoose.model("Report", reportSchema);
