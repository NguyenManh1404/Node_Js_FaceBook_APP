const Recipe = require("../../models/Recipe");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const RecipeController = {
  // [POST] /api/post
  async create(req, res) {
    try {
      const {
        name,
        linkVideo,
        images,
        categories,
        serves,
        cookTime,
        ingredients,
        steps,
      } = req.body;
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decodedToken);
      const newRecipe = await new Recipe({
        name: name,
        linkVideo: linkVideo,
        images: images,
        categories: categories,
        serves: serves,
        cookTime: cookTime,
        ingredients: ingredients,
        steps: steps,
        author: decodedToken.id,
      });
      await newRecipe.save();
      res.status(200).json({ msg: "Recipe was created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },
};

module.exports = RecipeController;
