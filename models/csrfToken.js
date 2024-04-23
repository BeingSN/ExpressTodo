const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const csrfTokens = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  csrfToken: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("csrfTokens", csrfTokens);
