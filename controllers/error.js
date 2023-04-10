exports.get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
  });
};

exports.getError = (req, res, next) => {
  render("error", {
    pageTitle: "error",
  });
};
