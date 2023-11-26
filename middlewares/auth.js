module.exports.isLoggedIn = (req, res, next) => {
  const isAuthenticated = req.isAuthenticated();

  if (!isAuthenticated) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in");
    res.redirect("/");
    return;
  }

  next();
};

module.exports.isLoggedOut = (req, res, next) => {
  const isAuthenticated = req.isAuthenticated();

  if (isAuthenticated) {
    res.redirect("/posts");
    return;
  }

  next();
};
