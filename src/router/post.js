const express = require('express'); //import
const router = express.Router(); //import
const validator = require("../validation/posts"); //import validator
const PostController = require("../app/controllers/PostController"); //import controller
const { verifyAccessToken } = require("../app/middleware/authentication");

router.get("/", verifyAccessToken, PostController.list);
router.get("/:id", verifyAccessToken, PostController.detail);
router.post("/upload", verifyAccessToken, validator.post, PostController.store);


module.exports = router;