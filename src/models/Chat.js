const mongoose = require("mongoose");
const { Schema } = mongoose;
let schema = new mongoose.Schema(
  {
    membersId: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    messages: [
      {
        senderId: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        content: {
          type: String,
        },
        images: [
          {
            type: String,
            default: [],
          },
        ],
        createdDay : Schema.Types.Date
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("chat", schema);
