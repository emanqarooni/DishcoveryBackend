const mongoose = require("mongoose")

const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, //createdAt, updatedAt
  }
)

const Rating = mongoose.model("Rating", ratingSchema)
module.exports = Rating
