const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { object } = require("joi");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    //identification
    userId: { type: String, unique: true, required: true },
    cardID: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    active: { type: Boolean, default: false },

    //profile info
    firstname: { type: String, default: "" },
    lastname: { type: String, default: "" },
    company: { type: String, default: null },
    title: { type: String, default: null },
    headline: { type: String, default: null },
    about: { type: String, default: null },
    website: { type: String, default: null },
    phone: { type: String, default: null },
    emailPublic: { type: String, default: null },
    socialLinks: { type: Array, default: [] },
    socialUserNames: { type: Array, default: [] },
    profileUrl: { type: String, default: null },
    bannerUrl: { type: String, default: null },

    //password and token info
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    emailToken: { type: String, default: null },
    emailTokenExpires: { type: Date, default: null },
    accessToken: { type: String, default: null },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

const User = mongoose.model("user", userSchema);
module.exports = User;

module.exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Hashing failed", error);
  }
};
module.exports.comparePasswords = async (inputPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    throw new Error("Comparison failed", error);
  }
};
