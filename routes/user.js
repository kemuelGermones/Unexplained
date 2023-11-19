const express = require("express");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middlewares/auth");
const { validateUserExistence } = require("../middlewares/validate");
const {
  renderLoginPage,
  renderSignupPage,
  renderProfilePage,
  loginUser,
  signupUser,
  logoutUser,
} = require("../controllers/user");

const router = express.Router();

router.get("/", renderLoginPage);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/",
    keepSessionInfo: true,
  }),
  loginUser
);

router.get("/signup", renderSignupPage);

router.post("/signup", signupUser);

router.get("/logout", logoutUser);

router.get(
  "/profile/:userId",
  isLoggedIn,
  validateUserExistence,
  wrapAsync(renderProfilePage)
);

module.exports = router;
