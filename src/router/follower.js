const express = require('express'); //import
const router = express.Router(); //import
const FollowerController = require("../app/controllers/FollowerController"); //import controller
const { verifyAccessToken } = require("../app/middleware/authentication");
const validator = require("../validation/follower"); //import validator

router.get("/", verifyAccessToken, FollowerController.list);
router.get("/following", verifyAccessToken, FollowerController.listFollowing);
router.post("/addFollower", verifyAccessToken, validator.follwer, FollowerController.addFollower);
router.delete("/:id", verifyAccessToken, FollowerController.unFollower);

module.exports = router;