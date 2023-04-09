const path = require("path");
const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home");

router.get("/", homeController.getHomePage);

router.get("/map", homeController.getMap);

router.get("/history", homeController.getHistory);

router.get("/admin", homeController.getAdmin);

module.exports = router;
