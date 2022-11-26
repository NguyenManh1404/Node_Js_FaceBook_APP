const Post = require("../../models/Post");
const { validationResult } = require("express-validator");
const { uploadImage } = require("../../shared/helper");

const PostController = {
  // [POST] /api/post
  async store(req, res) {
    //validation
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
      //gọi hàm upload image bằng cloudinary
      const urlImage = await uploadImage(imagePost?.path);

      const newPost = new Post({
        idUser: "62c39ca5adbd3436894b82e2",
        imagePost: urlImage.url,
        contentPost: contentPost,
        likePost: likePost,
        lovePost: lovePost,
        commentsPost: commentsPost,
        statusPost: statusPost,
      });
      await newPost.save();
      return res
        .status(200)
        .json({ msg: "Post was created successfully", data: newPost });
    } catch (error) {
      return res
        .status(res.error.http_code || 500)
        .json({ errors: [{ msg: error || res.error.message }] });
    }
  },
};

module.exports = PostController;
