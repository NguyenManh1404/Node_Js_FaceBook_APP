const mongoose = require("mongoose");
const { Schema } = mongoose;
let schema = new mongoose.Schema(
  {
    idUser: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "recipe",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("comment", schema);
