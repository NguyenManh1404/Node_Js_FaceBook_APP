
const admin = require('../../../config/pushnotification')
const express = require('express');
const Installation = require('../../models/Installation');


const NotificationController = {
  //[GET] api/notification/pushNotification
  async getNotification(req, res) {

   const message = {
     notification: {
       title: "Dẹmo",
       body: "Body demo",
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
     data: {
       title: " Message",
       body: "Manh",
       largeIcon:'https://st.depositphotos.com/11440342/54489/i/450/depositphotos_544892728-stock-photo-beautiful-woman-retro-camera-autumn.jpg',
     },
     //  token:"cLpYNZUbTK-P0GrPAV3CIy:APA91bHF96jyP-E1e9Z357rCQVmujHrh5Wi04kOOtajPTy7FxvhwC5kVRhWM0lIOPA-nBfkQTld8HwbzvIQeFNdUCqIsNjZ4Brei1UlBhixdM3Yy10DmZvtyEO7e5uXyLnnv8iy5iw2J"
     token:
       "e33u0NrmTbqCgVMxTPgY_2:APA91bGq0msLVMjjkfZyyX5Pa84-cntrxFshtzijDEQbqCiAI48dq-Ylde-xNImSwHuidQS9mMRR-ggVrqDI6bfvX6NCLuUt3Mr-l97hCQOP45vrTWBQnkrBEw3ezxCSJj2eYfOQ_XLz",
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

    return res.json({ name: "Hug Manh", password: "get notify" });
  },

  async getNotificationFollower(req, res) {

    const follower = {
      title: "You are new follow",
      // name: req.body.name,
      // name_follower: req.body.name_follower
    }

    const message = {
      notification: {
        title: "Demo Notification",
        body: follower,
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
        req.body.token,
    };
 

    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const install = await Installation.find({
      userID: decodedToken
    });

    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Message sent successfully:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
 
     return res.json({ name: "Hug Manh", password: "get notify", device: install });
   },

  

};

module.exports = NotificationController;