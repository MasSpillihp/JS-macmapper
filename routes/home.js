const express = require("express");
const router = express.Router();

const googleController = require("../controllers/google");
const logsController = require("../controllers/logs");

router.get("/", googleController.getHomePage);

router.get("/search-history", logsController.getAllLogs);

router.post("/search-results", logsController.searchLogs);

module.exports = router;
