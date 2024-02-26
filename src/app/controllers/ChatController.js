const Chat = require("../../models/Chat");
const User = require("../../models/User");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Installation = require("../../models/Installation");
const admin = require("../../../config/pushnotification");

const ChatController = {
  //[POST] /api/chat/add_new_message

  async addNewMessage(req, res) {
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    try {
      const { idUserReceive, content, images } = req.body;

      const existingChat = await Chat.findOne({
        membersId: { $all: [idUserReceive, decodedToken?.id] },
      });

      if (existingChat) {
        // Nếu cuộc trò chuyện đã tồn tại, thêm tin nhắn vào cuộc trò chuyện đó
        existingChat.messages.push({
          senderId: decodedToken?.id,
          content: content,
          images: images,
        });

        await existingChat.save();
      } else {
        // Nếu chưa có thì tạo mới
        const newChat = await new Chat({
          membersId: [idUserReceive, decodedToken?.id],
          messages: [
            { senderId: decodedToken?.id, content: content, images: images },
          ],
        });
        await newChat.save();
      }

      //Lấy thông tin user
      const user = await User.findById(decodedToken?.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      //Lấy thông tin user người nhận
      const userReceive = await User.findById(idUserReceive);
      if (!userReceive) {
        return res.status(404).json({ error: "User not found" });
      }

      //Lây tokenMessage theo nhung devices mà user đã đăng nhập
      const tokens = await Installation.find({ userID: idUserReceive }).select(
        "tokenDevice"
      );
      //format lại
      const tokenDevices = tokens.map((item) => item.tokenDevice);

      /// Get Notification
      const message = {
        // notification: {
        //   title: ` ${user?.lastName} ${user?.firstName} send to ${userReceive?.lastName} ${userReceive?.firstName} a message `,
        //   body: `You have a message from ${user?.lastName} ${user?.firstName}. Please check your message`,
        //   imageUrl: "https://foo.bar.pizza-monster.png",
        // },
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
          title: ` ${user?.lastName} ${user?.firstName} send to ${userReceive?.lastName} ${userReceive?.firstName} a message `,
          body: `You have a message from ${user?.lastName} ${user?.firstName}. Please check your message`,
          avatarUserSend: user?.avatar,
        },
        tokens: tokenDevices, // truyền mảng tokens
      };

      await admin
        .messaging()
        .sendEachForMulticast(message)
        .then((response) => {
          console.log("Message sent successfully:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });

      //return response
      res.status(200).json({ msg: "A Chat was created successfully" });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ errors: [{ message: "Internal server error", error }] });
    }
  },

  //[GET] /api/chat/get_chat_with_userId/:idUserReceive
  async getChatWithId(req, res) {
    const { idUserReceive } = req.params;
    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    try {
      const user = await User.findById(decodedToken?.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const existingChat = await Chat.findOne({
        membersId: { $all: [idUserReceive, decodedToken?.id] },
      });

      //res
      return res
        .status(200)
        .json({ data: existingChat, message: "Get list successfully" });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ errors: [{ message: "Internal server error", error }] });
    }
  },

  //[GET] api/chat/get_all_list_chat

  async getAllListChat(req, res) {
    try {
      const authHeader = req.get("Authorization");
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const chats = await Chat.find({
        membersId: decodedToken.id,
      });
      //dùng promise để chống bất đồng bộ
      const formatChat = await Promise.all(
        chats?.map(async (chat) => {
          const otherIds = chat.membersId;
          const messages = chat.messages;
          const otherId = otherIds.filter(
            (id) => id.toString() !== decodedToken.id.toString()
          );

          const user = await User.findById(otherId[0]);

          return {
            idUserReceive: user?._id,
            otherUserFullName: user?.lastName + " " + user?.firstName,
            otherUserAvatar: user?.avatar,
            lastMessage: messages[messages.length - 1],
            timeCreate: chat?.updatedAt,
          };
        })
      );
      //res
      return res
        .status(200)
        .json({ data: formatChat, message: "Get list successfully" });
    } catch (error) {
          console.error(error.message);
          return res
            .status(500)
            .json({ errors: [{ message: "Internal server error", error }] });
    }
  },

  //[GET] api/notification/pushNotification
  async getNotification(req, res) {
    // const message = {
    //   notification: {
    //     title: "Dẹmo",
    //     body: "Body demo",
    //     imageUrl: "https://foo.bar.pizza-monster.png",
    //   },
    //   android: {
    //     notification: {
    //       sound: "default",
    //       imageUrl: "https://foo.bar.pizza-monster.png",
    //     },
    //   },
    //   webpush: {
    //     headers: {
    //       image: "https://foo.bar.pizza-monster.png",
    //     },
    //   },
    //   token: [
    //     "eF2b7b3PQUJ_nYohAiC9zi:APA91bF8r_vZz2D-qKXY6xtBps6jmF_ToqY66vg0-P8amS2mn-jJvOjhwy6SazHaRjIcRTNic2HqwEnqPD-lnc-Kvk-tUl-oEHRBRncG3wb4BMbiRmlGclLYrTRZMqZaIbDZ9Mx1TPYC",
    //     "ctg9WpyhRwmSFh8m8K_OjR:APA91bFyN0TVmbZHWwh-vJ4E7vuOMIE3uBH3Z966vNHoJObZ6hCBASBKGnyYfBdMTnx1JHKLDPy9TKXzUxxj_Xz81q4r04YuUEZw4de-oG0aEZoEkyc0G1QKo1KWPoneykk-yI6ySqKK",
    //   ],
    // };

    // admin
    //   .messaging()
    //   .send(message)
    //   .then((response) => {
    //     console.log("Message sent successfully:", response);
    //   })
    //   .catch((error) => {
    //     console.log("Error sending message:", error);
    //   });

    /// Get Notification
    const message = {
      // notification: {
      //   title: ` ${user?.lastName} ${user?.firstName} send to ${userReceive?.lastName} ${userReceive?.firstName} a message `,
      //   body: `You have a message from ${user?.lastName} ${user?.firstName}. Please check your message`,
      //   imageUrl: "https://foo.bar.pizza-monster.png",
      // },
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
        title: ` ${user?.lastName} ${user?.firstName} send to ${userReceive?.lastName} ${userReceive?.firstName} a message `,
        body: `You have a message from ${user?.lastName} ${user?.firstName}. Please check your message`,
        avatarUserSend: user?.avatar,
      },
      tokens: [
        "eF2b7b3PQUJ_nYohAiC9zi:APA91bF8r_vZz2D-qKXY6xtBps6jmF_ToqY66vg0-P8amS2mn-jJvOjhwy6SazHaRjIcRTNic2HqwEnqPD-lnc-Kvk-tUl-oEHRBRncG3wb4BMbiRmlGclLYrTRZMqZaIbDZ9Mx1TPYC",
      ],
    };

    await admin
      .messaging()
      .sendEachForMulticast(message)
      .then((response) => {
        console.log("Message sent successfully:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });

    return res.json({ name: "Hug Manh", password: "get notifys" });
  },

  async getNotificationFollower(req, res) {
    const follower = {
      title: "You are new follow",
      // name: req.body.name,
      // name_follower: req.body.name_follower
    };

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
      token: req.body.token,
    };

    const authHeader = req.get("Authorization");
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const install = await Installation.find({
      userID: decodedToken,
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

    return res.json({
      name: "Hug Manh",
      password: "get notify",
      device: install,
    });
  },
};

module.exports = ChatController;
