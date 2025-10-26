const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
  {
    likes: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
  },
  {
    timestamps: true, //createdAt, updatedAt
  }
)

const Post = mongoose.model("Post", postSchema)
module.exports = Post
