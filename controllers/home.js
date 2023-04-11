const fs = require("fs");
const { lastSearch, getAllSearches, getSearchbyID } = require("../models/db");
const { parseArgs } = require("util");
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
    const locations = await getAllSearches();
    const limit = 10; // sets the limit records per page to 10
    const totalCount = locations.length;
    let currentPage = req.query.page ? parseInt(req.query.page) : 1; // current page number
    let startIndex = (currentPage - 1) * limit; // index of first record to show on current page
    res.render("search", {
      pageTitle: "Search",
      path: "/search",
      locations: locations,
      startIndex: startIndex,
      limit: limit,
      totalCount: totalCount,
      currentPage: currentPage,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.mapSpecificSearch = async (req, res, next) => {
  try {
    const locationId = req.params.id;
    const location = await getSearchbyID(locationId);
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
