const User = require("../models/user");
const Post = require("../models/post");

module.exports.renderLoginPage = (req, res, next) => {
  res.status(200).render("pages/login.ejs");
};

module.exports.renderSignupPage = (req, res, next) => {
  res.status(200).render("pages/signup.ejs");
};

module.exports.renderProfilePage = async (req, res, next) => {
  const { user } = res.locals;

  const posts = await Post.find({ author: user._id }).populate("author");

  res.status(200).render("pages/profile.ejs", { user, posts });
};

module.exports.signupUser = (req, res, next) => {
  const REDIRECT_URL = req.session.returnTo || "/posts";
  const { email, username, password } = req.body;

  const user = new User({ email, username });

  User.register(user, password)
    .then((client) => {
      req.login(client, (error) => {
        if (error) {
          req.flash("error", "Something went wrong");
          res.status(400).redirect("/signup");
          return;
        }
        req.flash("success", "Successfully created an account");
        res.status(200).redirect(REDIRECT_URL);
        delete req.session.returnTo;
      });
    })
    .catch((error) => {
      req.flash(
        "error",
        "A user with the given username or email is already registered"
      );
      res.status(400).redirect("/signup");
    });
};

module.exports.loginUser = (req, res, next) => {
  const REDIRECT_URL = req.session.returnTo || "/posts";

  req.flash("success", "Welcome Back");
  res.status(200).redirect(REDIRECT_URL);

  delete req.session.returnTo;
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((error) => {
    if (error) {
      req.flash("error", "Something went wrong");
      res.status(400).redirect("back");
      return;
    }
    req.flash("success", "Goodbye");
    res.status(200).redirect("/");
  });
};
