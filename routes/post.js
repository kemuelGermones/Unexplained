const express = require("express");
const multer = require("multer");
const wrapAsync = require("../utils/wrapAsync");
const { storage } = require("../configs/cloudinary");
const { isLoggedIn } = require("../middlewares/auth");
const {
  validatePostCategory,
  validatePostBody,
  validatePostExistence,
  validatePostOwner,
} = require("../middlewares/validate");
const {
  renderPostsPage,
  renderCreatePostPage,
  renderEditPostPage,
  createPost,
  getPost,
  editPost,
  deletePost,
} = require("../controllers/post");

const router = express.Router();
const upload = multer({ storage });

router.get("/", validatePostCategory, wrapAsync(renderPostsPage));

router.post(
  "/",
  isLoggedIn,
  upload.array("images"),
  validatePostBody,
  wrapAsync(createPost)
);

router.get("/new", isLoggedIn, renderCreatePostPage);

router.get("/:postId", validatePostExistence, wrapAsync(getPost));

router.put(
  "/:postId",
  isLoggedIn,
  validatePostExistence,
  validatePostOwner,
  upload.array("images"),
  validatePostBody,
  wrapAsync(editPost)
);

router.delete(
  "/:postId",
  isLoggedIn,
  validatePostExistence,
  validatePostOwner,
  wrapAsync(deletePost)
);

router.get(
  "/:postId/edit",
  isLoggedIn,
  validatePostExistence,
  validatePostOwner,
  wrapAsync(renderEditPostPage)
);

module.exports = router;
