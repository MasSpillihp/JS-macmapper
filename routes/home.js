const express = require("express");
const router = express.Router();

const googleController = require("../controllers/google");
const logsController = require("../controllers/logs");
const isAuth = require("../middleware/is-auth");

router.get("/", googleController.getHomePage);

router.post("/googlesearch", isAuth, googleController.postGoogle);

router.get("/search-history", isAuth, logsController.getAllLogs);

router.post("/search-results", isAuth, logsController.searchLogs);

module.exports = router;
