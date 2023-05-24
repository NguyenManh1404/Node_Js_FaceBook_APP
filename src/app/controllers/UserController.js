const User = require("../../models/User");
const { validationResult } = require("express-validator");
const UserController = {
  // [GET] /api/user
  async list(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {

      const data = await User.find({}).sort({ createdAt: 'descending' })
      res.status(200).json({ msg: 'get user list success', data });

    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  // [GET] /api/popular-creator
  async popularCreator(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {

      const data = await User.aggregate([
        {
          $lookup: {
            from: 'post',
            localField: '_id',
            foreignField: 'idUser',
            as: 'post',
          },
        },
        {
          $addFields: {
            totalLikes: { $sum: '$post.likePost' },
          },
        },
        {
          $sort: {
            totalLikes: -1,
          },
        },
      ]);


      res.status(200).json({ msg: 'get user list success', data });

    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },
};

module.exports = UserController;
