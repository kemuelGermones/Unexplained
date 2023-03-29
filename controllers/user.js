const User = require("../models/user");
const Report = require("../models/report");

// Render login page

module.exports.renderLoginForm = async (req, res, next) => {
  res.render("users/login.ejs");
};

// login user

module.exports.loginUser = (req, res, next) => {
  req.flash("success", "Welcome Back");
  const redirectUrl = req.session.returnTo || "/reports";
  res.redirect(redirectUrl);
  delete req.session.returnTo;
};

// Render signup poge

module.exports.renderSignupForm = (req, res, next) => {
  res.render("users/signup.ejs");
};

// Register user

module.exports.signupUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Successfully Signed-up");
      res.redirect("/reports");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Logout user

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye");
    res.redirect("/reports");
  });
};

// Render profile page

module.exports.profile = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const reports = await Report.find({ author: id }).populate("author");
  res.render("users/profile.ejs", { reports, user });
};
