const Recipe = require("../../models/Recipe");
const User = require("../../models/User");
const Favorite = require("../../models/Favorite");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const RecipeController = {
  // [POST] /api/recipe/create
  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const {
        name,
        linkVideo,
        images,
        categories,
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

  //[GET] /api/recipe/breakfast
  async getBreadFast(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decodedToken);
      const userId = decodedToken.id;

      const recipes = await Recipe.find({ categories: "1" })
        .sort({
          updatedAt: -1,
        })
        .lean();

      // Loop through each recipe and check if it is a favorite for the user
      for (const recipe of recipes) {
        const isFavorite = await Favorite.exists({
          userId: userId,
          recipeId: recipe._id,
        });
        recipe.isFavorite = isFavorite ? true : false;
      }

      res.status(200).json({ msg: "Get list recipe successfully", recipes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  //[GET] /api/recipe/lunch
  async getLunch(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decodedToken);
      const userId = decodedToken.id;
      const recipes = await Recipe.find({ categories: "2" })
        .sort({
          updatedAt: -1,
        })
        .lean();

      // Loop through each recipe and check if it is a favorite for the user
      for (const recipe of recipes) {
        const isFavorite = await Favorite.exists({
          userId: userId,
          recipeId: recipe._id,
        });
        recipe.isFavorite = isFavorite ? true : false;
      }

      res.status(200).json({ msg: "Get list recipe successfully", recipes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  //[GET] /api/recipe/diner
  async getDiner(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decodedToken);
      const userId = decodedToken.id;
      const recipes = await Recipe.find({ categories: "3" })
        .sort({
          updatedAt: -1,
        })
        .lean();

      // Loop through each recipe and check if it is a favorite for the user
      for (const recipe of recipes) {
        const isFavorite = await Favorite.exists({
          userId: userId,
          recipeId: recipe._id,
        });
        recipe.isFavorite = isFavorite ? true : false;
      }

      res.status(200).json({ msg: "Get list recipe successfully", recipes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  //[GET] /api/recipe/diet
  async getDiet(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decodedToken);
      const userId = decodedToken.id;
      const recipes = await Recipe.find({ categories: "4" })
        .sort({
          updatedAt: -1,
        })
        .lean();

      // Loop through each recipe and check if it is a favorite for the user
      for (const recipe of recipes) {
        const isFavorite = await Favorite.exists({
          userId: userId,
          recipeId: recipe._id,
        });
        recipe.isFavorite = isFavorite ? true : false;
      }

      res.status(200).json({ msg: "Get list recipe successfully", recipes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  //[GET] /api/recipe/recent
  async getRecentRecipe(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decodedToken);
      const userId = decodedToken.id;

      const recipes = await Recipe.find().sort({ updatedAt: -1 }).limit(10);
      // Sử dụng .lean() để chuyển đổi kết quả từ Object Mongoose thành JavaScript object; // Thêm phương thức .limit(10) để giới hạn kết quả trả về là 10

      // Lấy danh sách userId của người tạo trong các công thức
      const userIds = recipes.map((recipe) => recipe.author);

      // Tìm người dùng tương ứng với từng userId
      const creators = await User.find({ _id: { $in: userIds } });

      // Tạo một đối tượng tương ứng giữa userId và tên người tạo
      const creatorMap = {};
      creators.forEach((creator) => {
        creatorMap[creator._id] = creator.firstName;
      });

      const favorites = await Favorite.find({ userId });

      const favoriteRecipeIds = favorites.map((favorite) =>
        favorite.recipeId.toString()
      );
      const recipesWithCreatorAndFavorite = recipes.map((recipe) => {
        const isFavorite = favoriteRecipeIds.includes(recipe._id.toString());
        return {
          ...recipe._doc,
          creatorName: creatorMap[recipe.author],
          isFavorite,
        };
      });

      // Get ra list
      res.status(200).json({
        msg: "Get list recipe successfully",
        recipes: recipesWithCreatorAndFavorite,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  //[GET] /api/recipe/trending
  async trendingNow(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
   try {
     const authHeader = req.get("Authorization");
     const token = authHeader.split(" ")[1];
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
     console.log(decodedToken);
     const userId = decodedToken.id;
     const topRecipes = await Favorite.aggregate([
       { $group: { _id: "$recipeId", count: { $sum: 1 } } },
       { $sort: { count: -1 } },
       { $limit: 10 },
       {
         $lookup: {
           from: "recipes",
           localField: "_id",
           foreignField: "_id",
           as: "recipe",
         },
       },
       { $unwind: "$recipe" },
       {
         $lookup: {
           from: "favorites",
           let: { recipeId: "$recipe._id", userId: userId },
           pipeline: [
             {
               $match: {
                 $expr: {
                   $and: [
                     { $eq: ["$recipeId", "$$recipeId"] },
                     { $eq: ["$userId", "$$userId"] },
                   ],
                 },
               },
             },
             { $limit: 1 },
           ],
           as: "favorite",
         },
       },
       {
         $addFields: {
           isFavorited: {
             $cond: { if: { $size: "$favorite" }, then: true, else: false },
           },
         },
       },
       {
         $project: {
           "recipe._id": 0,
           "recipe.createdAt": 0,
           "recipe.updatedAt": 0,
           favorite: 0,
         },
       },
     ]);

     res.status(200).json({ msg: "get post list success", topRecipes });
   } catch (error) {
     return res.status(500).json({ errors: [{ msg: error }] });
   }
  },

  //Muốn get 10 cái recipe có lượng yêu thích nhiều nhất
};

module.exports = RecipeController;
