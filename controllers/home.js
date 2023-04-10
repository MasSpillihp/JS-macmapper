const fs = require("fs");
const { lastSearch } = require("../models/db");
require("dotenv").config();

exports.getHomePage = (req, res, next) => {
  res.render("home", {
    pageTitle: "MAC Mapper Home",
  });
};

exports.getMap = async (req, res, next) => {
  try {
    const lastLocation = await lastSearch();
    res.render("map", {
      pageTitle: "Map",
      latitude: lastLocation.latitude,
      longitude: lastLocation.longitude,
      ref: lastLocation.ref,
      apiKey: process.env.GOOLE_API_KEY,
      zoom: 10,
    });
  } catch (error) {
    console.log(error);
    res.render("error", {
      pageTitle: "Error",
      errorName: "An error occured whilst loading the map",
    });
  }
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
