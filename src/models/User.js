const mongoose = require('mongoose');
const { USER_ROLE } = require('../utils/constant');

let schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerificationCode: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      trim: true,
      default: "",
    },
    position: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    region: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      default: USER_ROLE.USER_ROLE,
      enum: Object.values(USER_ROLE)
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('user', schema);