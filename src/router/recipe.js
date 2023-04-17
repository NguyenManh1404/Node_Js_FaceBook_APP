const express = require("express"); //import
const router = express.Router(); //import
const RecipeController = require("../app/controllers/RecipeController"); //import controller
const { verifyAccessToken } = require("../app/middleware/authentication");

router.post("/create", verifyAccessToken, RecipeController.create);

module.exports = router;
