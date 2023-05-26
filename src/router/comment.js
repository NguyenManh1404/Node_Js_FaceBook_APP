const express = require('express'); //import
const router = express.Router(); //import
const CommentController = require("../app/controllers/CommentController"); //import controller
const { verifyAccessToken } = require("../app/middleware/authentication");
const validator = require("../validation/comment"); //import validator

router.get("/", verifyAccessToken, CommentController.list);
router.post("/addComment", verifyAccessToken, validator.comment, CommentController.addComment);
router.delete("/:id", verifyAccessToken, CommentController.deleteComment);

module.exports = router;