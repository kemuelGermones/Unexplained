const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const { createComment, deleteComment } = require("../controllers/comment");
const { isLoggedIn } = require("../middlewares/auth");
const {
  validatePostExistence,
  validateCommentBody,
  validateCommentExistence,
  validateCommentOwner,
} = require("../middlewares/validate");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isLoggedIn,
  validatePostExistence,
  validateCommentBody,
  wrapAsync(createComment)
);

router.delete(
  "/:commentId",
  isLoggedIn,
  validateCommentExistence,
  validateCommentOwner,
  wrapAsync(deleteComment)
);

module.exports = router;
