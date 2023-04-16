const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");

const googleController = require("../controllers/google");
const logsController = require("../controllers/logs");
const isAuth = require("../middleware/is-auth");

router.get("/", googleController.getHomePage);

router.post(
  "/googlesearch",
  // MAC address validation
  [
    body("mac1")
      .isMACAddress({ no_separators: false })
      .withMessage(
        "Please enter a valid MAC address with seperators (: ; - or . )"
      ),
    body("mac2")
      .isMACAddress({ no_separators: false })
      .withMessage(
        "Please enter a valid MAC address with seperators (: ; - or . )"
      )
      .custom((value, { req }) => {
        if (value == req.body.mac1) {
          throw new Error("Please enter two different MAC addresses");
        }
        return true;
      }),
  ],
  isAuth,
  googleController.postGoogle
);

router.get("/search-history", isAuth, logsController.getAllLogs);

router.post("/search-results", isAuth, logsController.searchLogs);

module.exports = router;
