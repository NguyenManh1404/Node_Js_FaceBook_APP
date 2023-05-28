const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Follower = require("../../models/Follower");
const NotificationController = require("../controllers/NotificationController");
const User = require("../../models/User");

const FollowerController = {

    // [GET] /api/follower
    async list(req, res) {
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
      try {
        const data = await Follower.find({
          idUser: decodedToken.id
        }).sort({ createdAt: 'descending' })
        res.status(200).json({ msg: 'get follwer list success', data });
  
      } catch (error) {
        return res.status(500).json({ errors: [{ msg: error }] });
      }
    },

  // [POST] /api/follower
  async addFollower(req, res) {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const errors = validationResult(req);
    const idUser = decodedToken.id;

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const { idUserFollower } = req.body;

      const user = await User.findById(idUser);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userFollower = await User.findById(idUserFollower);
      if (!userFollower) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      console.log('idUserFollower', idUserFollower);
      const newFollower = await new Follower({
        idUser: idUser,
        idUserFollower: idUserFollower
      });
      await newFollower.save();
      NotificationController.getNotificationFollower(req);
      res. status(200).json({ msg: "Follower was created successfully" });
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: error }] });
    }
  },

    // [DELETE] /api/follower/:id
    async unFollower(req, res) {
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const errors = validationResult(req);
      const idUser = decodedToken.id;
  
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
      try {
        const { idUserFollower } = req.body;
  
        const user = await User.findById(idUser);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
  
        const userFollower = await User.findById(idUserFollower);
        if (!userFollower) {
          return res.status(404).json({ error: "Recipe not found" });
        }
  
        console.log('idUserFollower', idUserFollower);
        const follower = await Follower.findOne({
          idUser: idUser,
          idUserFollower: idUserFollower
        });
        await follower.remove();
        res. status(200).json({ msg: "Unfollower successfully" });
      } catch (error) {
        return res.status(500).json({ errors: [{ msg: error }] });
      }
    },
};

module.exports = FollowerController;
