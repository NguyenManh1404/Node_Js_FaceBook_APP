const mongoose = require('mongoose');
const { Schema } = mongoose;

let schema = new mongoose.Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    tokenDevice: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('installation', schema);