exports.getAdmin = (req, res, next) => {
  res.render("admin", {
    pageTitle: "Admin",
    path: "/admin",
  });
};
