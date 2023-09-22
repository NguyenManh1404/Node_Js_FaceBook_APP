const express = require("express"); //import
const router = express.Router(); //import
const validator = require("../validation/posts"); //import validator
const ChatController = require("../app/controllers/ChatController"); //import controller
const { verifyAccessToken } = require("../app/middleware/authentication");

router.get(
  "/get_chat_with_userId/:idUserReceive",
  ChatController.getChatWithId
);

router.get("/get_all_list_chat", ChatController.getAllListChat);
// router.get("/trending-now", PostController.trendingNow);
// router.get("/:id", verifyAccessToken, PostController.detail);
router.post(
  "/add_new_message",
  verifyAccessToken,
  validator.post,
  ChatController.addNewMessage
);

module.exports = router;
