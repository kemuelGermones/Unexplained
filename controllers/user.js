const User = require("../models/user");
const Post = require("../models/post");

module.exports.renderLoginPage = (req, res, next) => {
  res.render("pages/login.ejs");
};

module.exports.renderSignupPage = (req, res, next) => {
  res.render("pages/signup.ejs");
};

module.exports.renderProfilePage = async (req, res, next) => {
  const { user } = res.locals;

  const posts = await Post.find({ author: user._id }).populate("author");

  res.render("pages/profile.ejs", { user, posts });
};

module.exports.signupUser = (req, res, next) => {
  const { email, username, password } = req.body;

  const user = new User({ email, username });

  User.register(user, password)
    .then((client) => {
      req.login(client, (error) => {
        if (error) {
          return next(error);
        }
        req.flash("success", "Successfully created an account");
        res.redirect("/posts");
      });
    })
    .catch((error) => {
      req.flash(
        "error",
        "A user with the given username or email is already registered"
      );
      res.redirect("/signup");
    });
};

module.exports.loginUser = (req, res, next) => {
  const REDIRECT_URL = req.session.returnTo || "/posts";

  req.flash("success", "Welcome Back");
  res.redirect(REDIRECT_URL);

  delete req.session.returnTo;
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(err);
    }
    req.flash("success", "Goodbye");
    res.redirect("/");
  });
};
