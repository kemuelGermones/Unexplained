const { postSchema, commentSchema, userSchema } = require("../schemas");
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const AppError = require("../utils/AppError");

const OPTIONS = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

module.exports.validatePostBody = (req, res, next) => {
  const { error } = postSchema.validate(req.body, OPTIONS);

  if (error) {
    const message = error.details[0].message;
    req.flash("error", message);
    res.status(400).redirect("back");
    return;
  }

  next();
};

module.exports.validatePostCategory = (req, res, next) => {
  const CATEGORIES = ["paranormal", "extraterrestrial", "others"];
  const { category } = req.query;

  if (category && !CATEGORIES.includes(category)) {
    throw new AppError("Post category doesn't exist", 400);
  }

  next();
};

module.exports.validatePostExistence = (req, res, next) => {
  const { postId } = req.params;

  Post.findById(postId)
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .populate("author")
    .then((post) => {
      if (!post) {
        throw new AppError("Post doesn't exist", 400);
      }
      res.locals.post = post;
      next();
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.validatePostOwner = (req, res, next) => {
  const { _id } = req.user;
  const { post } = res.locals;

  if (!post.author.equals(_id)) {
    throw new AppError("You are not allowed to edit/delete this post", 400);
  }

  next();
};

module.exports.validateCommentBody = (req, res, next) => {
  const { post } = res.locals;
  const { error } = commentSchema.validate(req.body, OPTIONS);

  if (error) {
    const message = error.details[0].message;
    req.flash("error", message);
    res.status(400).redirect(`/posts/${post._id}`);
    return;
  }

  next();
};

module.exports.validateCommentExistence = (req, res, next) => {
  const { commentId } = req.params;

  Comment.findById(commentId)
    .then((comment) => {
      if (!comment) {
        throw new AppError("Comment doesn't exist", 400);
      }
      res.locals.comment = comment;
      next();
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.validateCommentOwner = (req, res, next) => {
  const { _id } = req.user;
  const { comment } = res.locals;

  if (!comment.author.equals(_id)) {
    throw new AppError("You are not allowed to delete this comment", 400);
  }

  next();
};

module.exports.validateUserBody = (req, res, next) => {
  const { error } = userSchema.validate(req.body, OPTIONS);

  if (error) {
    const message = error.details[0].message;
    req.flash("error", message);
    res.status(400).redirect("/signup");
    return;
  }

  next();
};

module.exports.validateUserExistence = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new AppError("User doesn't exist", 400);
      }
      res.locals.user = user;
      next();
    })
    .catch((error) => {
      next(error);
    });
};
