const fs = require("fs");
const {
  lastSearch,
  getAllSearches,
  getSearchbyID,
  getSearchResults,
} = require("../models/db");
const { parseArgs } = require("util");
require("dotenv").config();

exports.getHomePage = (req, res, next) => {
  // loads the /Home page which contains the user form to search for MAC addresses
  res.render("home", {
    pageTitle: "Home",
    path: "/",
  });
};

exports.getMap = async (req, res, next) => {
  // loads the /map page which defaults to loads the last searched MAC address
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

exports.getSeeAllSearches = async (req, res, next) => {
  // loads the search page which will hold a table containing all the searches performed in groups of 10
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
  // loads the /map page but instead of last search, it loads the specific search by the user from
  // the /search page - by clicking 'map' on the locations table
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

exports.SearchResults = async (req, res, next) => {
  // takes search query from search.ejs form and queries database. renders /search-results with results
  const searchQuery = req.body.query;
  const searchResults = await getSearchResults(searchQuery);
  const limit = 10; // sets the limit records per page to 10
  const totalCount = searchResults.length;
  let currentPage = req.query.page ? parseInt(req.query.page) : 1; // current page number
  let startIndex = (currentPage - 1) * limit; // index of first record to show on current page
  //debug
  // console.log("search results: " + searchResults);
  res.render("search-results", {
    pageTitle: "Search Results",
    path: "/search",
    locations: searchResults,
    startIndex: startIndex,
    limit: limit,
    totalCount: totalCount,
    currentPage: currentPage,
  });
};
