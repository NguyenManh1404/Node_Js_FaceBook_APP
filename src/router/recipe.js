const express = require("express"); //import
const router = express.Router(); //import
const RecipeController = require("../app/controllers/RecipeController"); //import controller
const { verifyAccessToken } = require("../app/middleware/authentication");

router.post("/create", verifyAccessToken, RecipeController.create);
router.get("/breakfast", verifyAccessToken, RecipeController.getBreadFast);
router.get("/lunch", verifyAccessToken, RecipeController.getLunch);
router.get("/diner", verifyAccessToken, RecipeController.getDiner);
router.get("/diet", verifyAccessToken, RecipeController.getDiet);
router.get("/recent", verifyAccessToken, RecipeController.getRecentRecipe);
router.get("/trending", verifyAccessToken, RecipeController.trendingNow);

module.exports = router;
