const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const addTodo = new Schema({
  todo: {
    type: String,
    required: true,
  },
  todoDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("todos", addTodo);
