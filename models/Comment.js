const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: String,
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true, //createdAt, updatedAt
  }
)

const Comment = mongoose.model("Comment", commentSchema)
module.exports = Comment
