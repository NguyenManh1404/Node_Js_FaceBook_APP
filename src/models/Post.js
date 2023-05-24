const mongoose = require('mongoose');
const { Schema } = mongoose;
let schema = new mongoose.Schema(
  {
    idUser: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imagePost: {
      type: String,
      required: true,
    },
    contentPost: {
      type: String,
      required: true,
    },
    likePost: {
      type: Number,
      min: 0,
    },
    lovePost: {
      type: Number,
      min: 0,
    },
    commentsPost: {
      type: Number,
      min: 0,
    },
    statusPost: {
      type: Boolean,
      required: true,
      default: false,
    }
  }, {
  timestamps: true
})
module.exports = mongoose.model('post', schema);