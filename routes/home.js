const path = require("path");
const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home");

router.get("/", homeController.getHomePage);

router.get("/map/:id", homeController.mapSpecificSearch);

router.get("/map", homeController.getMap);

router.get("/search", homeController.getSeeAllSearches);

router.post("/search-results", homeController.SearchResults);

module.exports = router;
