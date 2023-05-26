const mongoose = require('mongoose');
const { Schema } = mongoose;
let schema = new mongoose.Schema(
  {
    idUser: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    idPost: {
      type: Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    content: {
      type: String,
      required: true,
    }
  }, {
  timestamps: true
})
module.exports = mongoose.model('comment', schema);