const fs = require("fs");
const { lastSearch, getAllSearches, getSearchbyID } = require("../models/db");
require("dotenv").config();

exports.getAdmin = (req, res, next) => {
  res.render("admin", {
    pageTitle: "Admin",
    path: "/admin",
  });
};
