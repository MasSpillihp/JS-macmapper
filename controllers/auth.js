exports.getLogin = (req, res, next) => {
  render("auth/login", {
    pageTitle: "Login",
    path: "/login",
  });
};
