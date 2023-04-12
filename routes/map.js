const express = require("express");
const router = express.Router();

const mapController = require("../controllers/map");

// router.get("/map", mapController.getMap);

router.get("/map/:id", mapController.mapSpecificSearch);

module.exports = router;
