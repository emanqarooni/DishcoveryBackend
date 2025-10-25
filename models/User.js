const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String, //hashed
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    image: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: String, // Can use Date to track token expiry
    },
  },
  {
    timestamps: true, //createdAt, updatedAt
  }
)

const User = mongoose.model("User", userSchema)
module.exports = User
