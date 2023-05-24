const express = require("express"); //import
const router = express.Router(); //import
const FavoriteController = require("../app/controllers/FavoriteController"); //import controller
const { verifyAccessToken } = require("../app/middleware/authentication");

router.post("/:id", verifyAccessToken,FavoriteController.addFavorite);
router.delete("/:id", verifyAccessToken, FavoriteController.unFavorite);
router.get("/list", verifyAccessToken, FavoriteController.getFavorite);
module.exports = router;
