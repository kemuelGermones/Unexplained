const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.createComment = async (req, res, next) => {
  const { post } = res.locals;
  const { _id } = req.user;

  const comment = new Comment(req.body);
  comment.author = _id;
  await comment.save();

  await post.updateOne({ $push: { comments: comment._id } });

  req.flash("success", "Successfully created a comment");
  res.redirect(`/posts/${post._id}`);
};

module.exports.deleteComment = async (req, res, next) => {
  const { postId } = req.params;
  const { comment } = res.locals;

  await Post.findByIdAndUpdate(postId, {
    $pull: { comments: comment._id },
  });
  await comment.deleteOne();

  req.flash("success", "Successfully deleted a comment");
  res.redirect(`/posts/${postId}`);
};
