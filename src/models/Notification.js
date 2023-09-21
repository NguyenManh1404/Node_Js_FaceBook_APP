const mongoose = require("mongoose");
const { Schema } = mongoose;
let schema = new mongoose.Schema(
  {
    idUserSend: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    idUserReceive: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("notification", schema);


// inboxId title description 
// 2      |enouvo| channel cua chug cua enouvuo

// userId inboxId
// 1 2
// 1 3
// 1 10

// Message
// inboxId senderId receivedId messageContent attachments[doc image pptx xlsx pdf]
// 10 1 2 sssssssss 
// 10 2 1 ádasd

// getAllIboxBYUserId
// 2,3,10

// getAllInboxes
// 2, e



