const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersModel = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  resetPasswordToken: { type: String },

  resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model("authUser", usersModel);
