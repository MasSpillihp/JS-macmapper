exports.get404 = (req, res, next) => {
  res.status(404).render("./errors/404", {
    pageTitle: "Page Not Found",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getError = (req, res, next) => {
  render("./errors/error", {
    pageTitle: "error",
    path: "/error",
    errorName: "test error",
    isAuthenticated: req.session.isLoggedIn,
  });
};
