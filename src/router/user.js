const express = require("express"); //import
const router = express.Router(); //import router      
const UserController = require("../app/controllers/UserController"); //import controller
const { verifyAccessToken } = require("../app/middleware/authentication");
const { uploadConfig } = require("../../config/upload");
const validator = require("../validation/users");

router.get("/", verifyAccessToken, UserController.list);
router.put(
  "/edit_profile",
  validator.updateAccount,
  UserController.editProfile
);
router.get(
  "/popular_creator",
  verifyAccessToken,
  UserController.popularCreator
);
router.get("/profile", verifyAccessToken, UserController.getProfile);
router.get("/:id", verifyAccessToken, UserController.getDetailUser);

router.get("/get-detail-user-other/:id", UserController.getDetailUserOther);


router.post("/upload", uploadConfig, UserController.upload);



module.exports = router;
