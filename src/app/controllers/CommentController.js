const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Follower = require("../../models/Follower");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const Recipe = require("../../models/Recipe");

const CommentController = {
  // [GET] /api/comment
  async list(req, res) {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    console.log(req.params);
    const { id } = req.params;
    try {
      const data = await Comment.find({
        recipeId: id,
      }).populate("idUser");
      res.status(200).json({ msg: "get comment list success", data });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  // [POST] /api/comment
  async addComment(req, res) {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const errors = validationResult(req);
    const idUser = decodedToken.id;

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const { recipeId, content } = req.body;

      const user = await User.findById(idUser);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ error: "Post not found" });
      }

      const newComment = await new Comment({
        idUser: idUser,
        recipeId: recipeId,
        content: content,
      });
      await newComment.save();
      res.status(200).json({ msg: "Comment was created successfully" });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  // [DELETE] /api/comment/:id
  async deleteComment(req, res) {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const errors = validationResult(req);
    const idUser = decodedToken.id;
    const { id } = req.params;

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const { idPost } = req.body;

      const user = await User.findById(idUser);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const post = await Post.findById(idPost);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const comment = await Comment.findOne({
        _id: id,
        idUser: idUser,
        idPost: idPost,
      });
      await comment.remove();
      res.status(200).json({ msg: "Delelte comment successfully" });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },
};

module.exports = CommentController;
