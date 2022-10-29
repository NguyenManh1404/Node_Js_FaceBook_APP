const Post = require('../../models/Post');
const { validationResult } = require('express-validator');



const PostController = {
  // [POST] /api/post
  async store(req, res) {

    // console.log("hhh", req.body.name);
    // res.status(200).json(req.body.name);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    console.log(req.body);
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