module.exports.isLoggedIn = (req, res, next) => {
  const isAuthenticated = req.isAuthenticated();

  if (!isAuthenticated) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in");
    res.status(400).redirect("/");
    return;
  }

  next();
};

module.exports.isLoggedOut = (req, res, next) => {
  const isAuthenticated = req.isAuthenticated();

  if (isAuthenticated) {
    res.status(400).redirect("/posts");
    return;
  }

  next();
};
