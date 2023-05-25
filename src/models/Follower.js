const mongoose = require('mongoose');
const { Schema } = mongoose;
let schema = new mongoose.Schema(
  {
    idUser: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    idUserFollower: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  }, {
  timestamps: true
})
module.exports = mongoose.model('follower', schema);