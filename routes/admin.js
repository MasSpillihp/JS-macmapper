const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/admin", adminController.getAdminLogs);
router.post("/admin/search-results", adminController.searchAdminLogs);
router.get("/admin/edit/:id", adminController.getSpecificLocation);
router.post("/admin/edit", adminController.postEditLocation);

module.exports = router;
