const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Follower = require("../../models/Follower");
const Recipe = require("../../models/Recipe");
const UserController = {
  // [GET] /api/user
  async list(req, res) {
    const errors = validationResult(req);

    const authHeader = req.get("Authorization");

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

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

    if (decodedToken?.id) {
      options._id = {
        $ne: decodedToken?.id,
      };
    }

    try {
      const data = await User.find(options).sort({ createdAt: "descending" });
      res.status(200).json({ msg: "get user list success", data });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },
  //[GET] api/otheruser
  async getDetailUserOther(req, res) {
    const id = req.params.id;

    const data = await User.findById(id);

    const recipes = await Recipe.find({
      author: id,
    });

    const follows = await Follower.find({
      idUser: id,
    });

    const following = await Follower.find({
      idUserFollower: id,
    });

    if (data) {
      res.status(200).json({
        msg: "get user",
        data,
        count_reciepes: recipes.length,
        reciepes: recipes,

        follow: follows.length,
        following: following.length,
      });
    } else {
      res.status(200).json({ msg: "user not found" });
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

  async getDetailUser(req, res) {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const idUser = decodedToken.id;
    const id = req.params.id;

    let follower = false;

    const checkFollower = await Follower.find({
      idUser: idUser,
      idUserFollower: id,
    });

    if (checkFollower.length > 0) {
      follower = true;
    }

    const data = await User.findById(id);

    if (data) {
      res.status(200).json({ msg: "get user", data, follower: follower });
    } else {
      res.status(200).json({ msg: "user not found" });
    }
  },

  //[PUT] api/user/edit_profile
  async editProfile(req, res) {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const idUser = decodedToken.id;

    //validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { firstName, lastName, avatar, phoneNumber } = req.body;
      await User.findByIdAndUpdate(idUser, {
        firstName,
        lastName,
        avatar,
        phoneNumber,
      });

      return res.status(200).json({ msg: "Update user successfully" });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal server error" }] });
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
