const express = require('express'); //import
const router = express.Router(); //import
const validator = require("../validation/posts"); //import validator
const PostController = require("../app/controllers/PostController"); //import controller
const { verifyAccessToken } = require("../app/middleware/authentication");

router.get("/", PostController.list);
router.get("/trending-now", PostController.trendingNow);
router.get("/:id", verifyAccessToken, PostController.detail);
router.post("/upload", verifyAccessToken, validator.post, PostController.store);
router.get("/get-post-current-user/:id", verifyAccessToken, PostController.getPostCurrentUser);
router.get("/not-approved", PostController.notApproved);
router.put("/approve/:id", PostController.approve);
router.get("/not-approve/:id", PostController.notApproveDetail);


module.exports = router;