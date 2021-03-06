const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 40,
  },
  brief: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 80,
  },
  describe: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 100000,
  },
  picture: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
  userView: [
    {
      type: String,
    },
  ],
  viewCounter: {
    type: Number,
    default: 0,
  },
  commentCounter: {
    type: Number,
    default: 0,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Article", ArticleSchema);
