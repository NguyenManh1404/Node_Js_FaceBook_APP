const Post = require("../../models/Post");
const { validationResult } = require("express-validator");
const cloudinary = require("../../../config/cloudinary");

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

      const uploadImage = async (imagePath) => {
        // Use the uploaded file's name as the asset's public ID and
        // allow overwriting the asset with new versions
        const options = {
          folder: "FacbookApp",
          resource_type: "image",
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        };

        try {
          // Upload the image
          const result = await cloudinary.uploader.upload(imagePath, options);
          return result;
        } catch (error) {
          console.error(error);
        }
      };

      const urlImage = await uploadImage(imagePost);
  
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
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },
};

module.exports = PostController;
