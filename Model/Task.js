const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    tags: {
      type: [String],
      default: [],
    },
    project: {
      type: [String],
      enum: ["one", "two", "three"],
      default: "one",
    },
    dueDate: {
      type: Date,
      default: Date.now(),
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: { type: Number, default: 0 },
    subtasks: { type: Number, default: 0 },
    thumbnail: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Task", taskSchema);
