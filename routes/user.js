const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");

// login page route

router.get("/", user.renderLoginForm);

// login user route

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/",
    keepSessionInfo: true,
  }),
  user.loginUser
);

// Signup page route

router.get("/signup", user.renderSignupForm);

// Signup user route

router.post("/signup", wrapAsync(user.signupUser));

// Logout user route

router.get("/logout", user.logoutUser);

// Profile overview route

router.get("/profile/:id", isLoggedIn, wrapAsync(user.profile));

module.exports = router;
