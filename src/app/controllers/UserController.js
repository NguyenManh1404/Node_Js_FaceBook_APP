const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const UserController = {
  // [GET] /api/user
  async list(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const options = {};

    if (req.query.firstName) {
      options.firstName = {
        $regex: ".*" + req.query.firstName + ".*",
      };
    }

    if (req.query.lastName) {
      options.lastName = {
        $regex: ".*" + req.query.lastName + ".*",
      };
    }

    if (req.query.email) {
      options.email = {
        $regex: ".*" + req.query.email + ".*",
      };
    }

    try {
      const data = await User.find(options).sort({ createdAt: "descending" });
      res.status(200).json({ msg: "get user list success", data });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  // [GET] /api/popular-creator
  async popularCreator(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const data = await User.aggregate([
        {
          $lookup: {
            from: "post",
            localField: "_id",
            foreignField: "idUser",
            as: "post",
          },
        },
        {
          $addFields: {
            totalLikes: { $sum: "$post.likePost" },
          },
        },
        {
          $sort: {
            totalLikes: -1,
          },
        },
      ]);

      res.status(200).json({ msg: "get user list success", data });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

  async getProfile(req, res) {
    const authHeader = req.get("Authorization");

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const data = await User.find({
      _id: decodedToken.id,
    });

    if (data) {
      res.status(200).json({ msg: "get user", data });
    } else {
      res.status(200).json({ msg: "user not found" });
    }
  },

  // Upload endpoint
  upload(req, res) {
    if (req.file) {
      try {
        const filePath = req.file.path;
        res.json({ filePath });
      } catch (error) {
        res.status(500).json({ error: error?.message });
      }
    } else {
      res.status(400).json({ error: "No file uploaded" });
    }
  },
};

module.exports = UserController;
