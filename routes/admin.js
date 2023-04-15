const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

router.get("/admin", isAuth, adminController.getAdminLogs);
router.post("/admin/search-results", isAuth, adminController.searchAdminLogs);
router.get("/admin/edit/:id", isAuth, adminController.getSpecificLocation);
router.post("/admin/edit", isAuth, adminController.postEditLocation);

module.exports = router;
