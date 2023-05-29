const express = require("express"); //import
const router = express.Router(); //import
const UserController = require("../app/controllers/UserController"); //import controller
const { verifyAccessToken } = require("../app/middleware/authentication");
const { uploadConfig } = require("../../config/upload");

router.get("/", verifyAccessToken, UserController.list);

router.get("/profile", verifyAccessToken, UserController.getProfile);
router.get("/:id", verifyAccessToken, UserController.getDetailUser)

router.get(
  "/popular-creator",
  verifyAccessToken,
  UserController.popularCreator
);
router.post("/upload", uploadConfig, UserController.upload);

module.exports = router;
