
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
     token:
       "cSJT3GsCRqWyjLiebThXPD:APA91bGandG4ZfWSqGRVLU5Qade35L_EfDA-E5re8n5xtc6YwQnIK67mIgE7qAGXocsyj3V9WWYjugkEZjjN-W_d9lXBc53Fn0Qn3DyAuE4IOykzU8AdX6Fr3XjKfyFhU4QabxkKXops",
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
      name: req.body.name,
      name_follower: req.body.name_follower
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