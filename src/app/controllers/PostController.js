const Post = require('../../models/Post');
const { validationResult } = require('express-validator');

const PostController = {

  // [GET] /api/detail/:id
  async detail(req, res) {
    const { id } = req.params
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {

      const data = await Post.find({ _id: id })
      res.status(200).json({ msg: 'get post list success', data });

    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  // [GET] /api/post
  async list(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {

      const data = await Post.find({}).sort({ createdAt: 'descending' })
      res.status(200).json({ msg: 'get post list success', data });

    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },
  // [POST] /api/post
  async store(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const {
        imagePost,
        contentPost,
        likePost,
        lovePost,
        commentsPost,
        statusPost
      } = req.body;
      const newPost = await new Post({
        idUser: "62c39ca5adbd3436894b82e2",
        imagePost: imagePost,
        contentPost: contentPost,
        likePost: likePost,
        lovePost: lovePost,
        commentsPost: commentsPost,
        statusPost: statusPost
      });
      await newPost.save();
      res.status(200).json({ msg: 'Post was created successfully' });

    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  }

}

module.exports = PostController;