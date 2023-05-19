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
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true,
      },
    ],
    serves: { type: Number, min: 0 },
    cookTime: { type: Number, min: 0 },
    ingredients: {
      name: { type: String },
      value: { type: String },
    },
    steps: [
      {
        type: String,
        default: [],
        required: true,
      },
    ], 
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("recipe", schema);
