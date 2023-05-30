const Post = require('../../models/Post');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const Admin = require('../../models/Admin');

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

    const options = {}
    if (req.query.contentPost) {
      options.contentPost = {
        $regex: '.*' + req.query.contentPost + '.*'
      }
    }
    options.statusPost = true;
    try {
      const data = await Post.find(options).sort({ createdAt: 'descending' })
      res.status(200).json({ msg: 'get post list success', data });

    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  // [GET] /api/post/trending-now
  async trendingNow(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const data = await Post.find({
        statusPost: true
      }).sort({ lovePost: 'descending' })
      res.status(200).json({ msg: 'get post list success', data });

    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  // [POST] /api/post
  async store(req, res) {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const {
        title,
        imagePost,
        contentPost,
        likePost,
        lovePost,
        commentsPost,
        statusPost
      } = req.body;
      const newPost = await new Post({
        idUser: decodedToken?.id,
        title: title,
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
  },

  // [GET] /api/post
  async getPostCurrentUser(req, res) {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('decodedToken', decodedToken);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const data = await Post.find({
        idUser: req.params.id
      }).sort({ createdAt: 'descending' });
      res.status(200).json({ msg: 'get post list success', data });

    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  // [GET] /api/post/not-approved
  async notApproved(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const options = {}
    if (req.query.contentPost) {
      options.contentPost = {
        $regex: '.*' + req.query.contentPost + '.*'
      }
    }
    options.statusPost = false;
    try {
      const data = await Post.find(options).sort({ createdAt: 'descending' })
      res.status(200).json({ msg: 'get post list success', data });

    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  // [POST] /api/post/approve/:id
  async approve(req, res) {
    // const authHeader = req.get("Authorization");
    // const token = authHeader.split(" ")[1];
    // const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // const idAdmin = decodedToken.id;

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const id = req.params.id
      const post = await Post.findByIdAndUpdate(id, {
        statusPost: true
      })
      await post.save()

      res.status(200).json({ msg: 'Post was approved successfully' });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  // [GET] /api/not-approve/:id
  async notApproveDetail(req, res) {
    const { id } = req.params
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const data = await Post.find({ _id: id, statusPost: false })
      res.status(200).json({ msg: 'get post detail success', data });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

}

module.exports = PostController;