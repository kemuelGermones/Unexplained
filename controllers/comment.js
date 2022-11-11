const Comment = require("../models/comment");
const Report = require("../models/report");

// Create a comment

module.exports.createComment = async (req, res) => {
  const { id } = req.params;
  const report = await Report.findById(id);
  const comment = new Comment(req.body.comment);
  (comment.author = req.user._id), report.comments.push(comment);
  await report.save();
  await comment.save();
  req.flash("success", "Successfully added a comment");
  res.redirect(`/reports/${id}`);
};

// Delete a comment

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  await Report.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash("success", "Successfully deleted a comment");
  res.redirect(`/reports/${id}`);
};
