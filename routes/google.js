const path = require("path");
const express = require("express");
const router = express.Router();

const googleController = require("../controllers/google");

router.post("/googlesearch", googleController.postGoogle);

module.exports = router;
