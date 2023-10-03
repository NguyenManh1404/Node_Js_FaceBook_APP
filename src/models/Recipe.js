const mongoose = require("mongoose");
const { Schema } = mongoose;
let schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    linkVideo: { type: String, required: true },
    images: [
      {
        type: String,
        default: [],
        required: true,
      },
    ],
    //get
    categories: [
      {
        type: String,
        default: [],
        required: true,
      },
    ],
    cookTime: { type: Number, min: 0 },
    ingredients: [
      {
        name: { type: String },
        quantity: { type: String },
      },
    ],
    steps: [{ number: { type: Number }, content: { type: String } }],
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    commentsPost: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("recipe", schema);
