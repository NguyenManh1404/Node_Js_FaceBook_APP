const express = require("express"); //import
const router = express.Router(); //import
const UserController = require("../app/controllers/UserController"); //import controller
const { verifyAccessToken } = require("../app/middleware/authentication");

router.get("/", verifyAccessToken, UserController.list);
router.get(
  "/popular-creator",
  verifyAccessToken,
  UserController.popularCreator
);
router.get("/profile", verifyAccessToken, UserController.getProfile);

module.exports = router;
