const express = require("express");
const router = express.Router({ mergeParams: true });
const comment = require("../controllers/comment");
const {
  validateComment,
  isLoggedIn,
  isCommentAuthor,
} = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

// Create comment route

router.post("/", isLoggedIn, validateComment, wrapAsync(comment.createComment));

// Delete comment route

router.delete(
  "/:commentId",
  isLoggedIn,
  isCommentAuthor,
  wrapAsync(comment.deleteComment)
);

module.exports = router;
