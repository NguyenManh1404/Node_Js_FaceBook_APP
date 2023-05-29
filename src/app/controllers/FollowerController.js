const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Follower = require("../../models/Follower");
const NotificationController = require("../controllers/NotificationController");
const User = require("../../models/User");
const admin = require("../../../config/pushnotification");

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

  // [POST] /api/follower/
  async addFollower(req, res) {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const errors = validationResult(req);
    const idUser = decodedToken.id;
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const { idUserFollower, deviceToken} = req.body;

      const user = await User.findById(idUser);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userFollower = await User.findById(idUserFollower);
      if (!userFollower) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      console.log("idUserFollower", idUserFollower);

      const newFollower = await new Follower({
        idUser: idUser,
        idUserFollower: idUserFollower,
      });
      await newFollower.save();

      /// Get Notification
      // const follower = {
      //   name: req.body.name,
      //   name_follower: req.body.name_follower,
      // };

      const message = {
        notification: {
          title: "Master Meal",
          body: "NOTI FOLLOW",
          imageUrl: "https://foo.bar.pizza-monster.png",
        },
        android: {
          notification: {
            sound: "default",
            imageUrl: "https://foo.bar.pizza-monster.png",
          },
        },
        webpush: {
          headers: {
            image: "https://foo.bar.pizza-monster.png",
          },
        },
        token:
          "c2vl3-NzTH-wwbxT0hjmX2:APA91bHPSEa-V26HBLHJkXafVyzL0zSUn_9NAtHM8kPJUK_x3KmAHEziCzCHufCN9PTrFTjDtD5-OByGPDhwK3FPdYTe9iDHbozdCeWP_vcAJ4m5VqubJ4yp8UKqBtwHMawoUH2q88V9",
      };

      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Message sent successfully:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
      /// Get Notification

      res.status(200).json({ msg: "Follower was created successfully" });
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
