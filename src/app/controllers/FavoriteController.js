const Recipe = require("../../models/Recipe");
const User = require("../../models/User");
const Favorite = require("../../models/Favorite");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const FavoriteController = {
  // [POST] /api/favorite/:id
  async addFavorite(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { id } = req.params;
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decodedToken);
      const userId = decodedToken.id;
      // Kiểm tra xem user có tồn tại không
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Kiểm tra xem recipe có tồn tại không
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      // Kiểm tra xem recipe đã được yêu thích bởi user chưa
      const favorite = await Favorite.findOne({
        userId: userId,
        recipeId: id,
      });

      if (favorite) {
        return res.status(400).json({ error: "Recipe already favorited" });
      }

      // Tạo một bản ghi yêu thích mới
      const newFavorite = new Favorite({ userId: userId, recipeId: id });
      await newFavorite.save();

      res.json({ message: "Recipe favorited successfully" });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  // [DELETE] /api/favorite/:id
  async unFavorite(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const { id } = req.params;
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decodedToken);
      const userId = decodedToken.id;
      // Kiểm tra xem use; có tồn tại không
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Kiểm tra xem recipe có tồn tại không
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      // Kiểm tra xem recipe đã được yêu thích bởi user chưa
      const favorite = await Favorite.findOne({
        userId: userId,
        recipeId: id,
      });

      if (!favorite) {
        return res.status(400).json({ error: "Recipe not favorited" });
      }

      // Xóa bản ghi yêu thích
      await favorite.remove();

      res.json({ message: "Recipe unfavorited successfully" });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  //[GET] /api/favorite/list

  async getFavorite(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decodedToken);
      const userId = decodedToken.id;

      // Kiểm tra xem user có tồn tại không
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Lấy danh sách các recipe yêu thích của user
      const favorites = await Favorite.find({ userId: userId });

      // Lấy danh sách các recipe dựa trên danh sách yêu thích
      const recipeIds = favorites.map((favorite) => favorite.recipeId);
      const recipes = await Recipe.find({ _id: { $in: recipeIds } });

      res.json({ message: "Get list recipe successfully", recipes });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },
  // [GET] /api/post
  async list(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const data = await Post.find({}).sort({ createdAt: "descending" });
      res.status(200).json({ msg: "get post list success", data });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },
  // [POST] /api/post
  async store(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const {
        imagePost,
        contentPost,
        likePost,
        lovePost,
        commentsPost,
        statusPost,
      } = req.body;
      const newPost = await new Post({
        idUser: "62c39ca5adbd3436894b82e2",
        imagePost: imagePost,
        contentPost: contentPost,
        likePost: likePost,
        lovePost: lovePost,
        commentsPost: commentsPost,
        statusPost: statusPost,
      });
      await newPost.save();
      res.status(200).json({ msg: "Post was created successfully" });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },
};

module.exports = FavoriteController;
