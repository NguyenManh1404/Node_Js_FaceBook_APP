const mongoose = require("mongoose");
const { Schema } = mongoose;
let schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imagePost: [
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
module.exports = mongoose.model("category", schema);
