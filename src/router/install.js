const express = require("express"); //import
const router = express.Router(); //import
const validator = require("../validation/posts"); //import validator
const { verifyAccessToken } = require("../app/middleware/authentication");
const InstallationController = require("../app/controllers/Installation");

router.get("/detail", verifyAccessToken, InstallationController.detail);

module.exports = router;
