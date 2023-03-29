const Comment = require("../models/comment");
const Report = require("../models/report");

// Create report comment

module.exports.createComment = async (req, res, next) => {
  const { reportId } = req.params;
  const comment = new Comment(req.body.comment);
  comment.author = req.user._id;
  await comment.save();
  await Report.findByIdAndUpdate(reportId, {
    $push: { comments: comment._id },
  });
  req.flash("success", "Successfully added a comment");
  res.redirect(`/reports/${reportId}`);
};

// Delete report comment

module.exports.deleteComment = async (req, res, next) => {
  const { reportId, commentId } = req.params;
  await Report.findByIdAndUpdate(reportId, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash("success", "Successfully deleted a comment");
  res.redirect(`/reports/${reportId}`);
};
