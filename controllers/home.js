const fs = require("fs");
const { lastSearch, getAllSearches, getSearchbyID } = require("../models/db");
const { off } = require("process");
require("dotenv").config();

exports.getHomePage = (req, res, next) => {
  res.render("home", {
    pageTitle: "Home",
    path: "/",
  });
};

exports.getMap = async (req, res, next) => {
  try {
    const lastLocation = await lastSearch();
    res.render("map", {
      pageTitle: "Map",
      path: "/map",
      ref: lastLocation.ref,
      mac1: lastLocation.mac1,
      mac2: lastLocation.mac2,
      accuracy: lastLocation.accuracy,
      latitude: lastLocation.latitude,
      longitude: lastLocation.longitude,
      apiKey: process.env.GOOLE_API_KEY,
      zoom: 10,
    });
  } catch (error) {
    console.log(error);
    res.render("error", {
      pageTitle: "Error",
      errorName: "An error occured whilst loading the map",
      path: "/error",
    });
  }
};

exports.getSearch = async (req, res, next) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const locations = await getAllSearches(offset, limit);
    res.render("search", {
      pageTitle: "Search",
      path: "/search",
      locations: locations,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.mapSpecificSearch = async (req, res, next) => {
  try {
    const locationId = req.params.id;
    const location = await getSearchbyID(locationId);
    console.log(location[0].id);
    res.render("specific-map", {
      pageTitle: "View Search",
      path: "/map",
      location: location,
      ref: location[0].ref,
      mac1: location[0].mac1,
      mac2: location[0].mac2,
      accuracy: location[0].accuracy,
      latitude: location[0].latitude,
      longitude: location[0].longitude,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAdmin = (req, res, next) => {
  res.render("admin", {
    pageTitle: "Admin",
    path: "/admin",
  });
};
