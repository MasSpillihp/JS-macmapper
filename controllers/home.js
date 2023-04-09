exports.getHomePage = (req, res, next) => {
  res.render("home", {
    pageTitle: "MAC Mapper Home",
  });
};

exports.getMap = (req, res, next) => {
  res.render("map", {
    pageTitle: "Map",
  });
};

exports.getHistory = (req, res, next) => {
  res.render("history", {
    pageTitle: "History",
  });
};

exports.getAdmin = (req, res, next) => {
  res.render("admin", {
    pageTitle: "Admin",
  });
};
