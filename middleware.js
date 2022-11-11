const { reportSchema, commentSchema } = require("./schemas");
const AppError = require("./utils/AppError");
const Report = require("./models/report");
const Comment = require("./models/comment");

// Validate report middleware using reportSchema from joi

module.exports.validateReport = (req, res, next) => {
  const { error } = reportSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

// Validate comment middleware using commentSchema from joi

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

// Checks if the user is logged in

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/");
  } else {
    next();
  }
};

// Checks if the user is the owner of the report

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const report = await Report.findById(id);
  if (!report.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect("/reports");
  }
  next();
};

// Checks if the user is the owner of the comment

module.exports.isCommentAuthor = async (req, res, next) => {
  const { id, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/reports/${id}`);
  }
  next();
};
