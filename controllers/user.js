const User = require("../models/User")
const Recipe = require("../models/Recipe")

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params

    //get user info excluding sensitive data
    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    )

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    //get all recipes favorited by this user and include recipe owner info
    const favoritedRecipes = await Recipe.find({
      favouritedByUsers: userId,
    }).populate("owner", "username email image")

    res.status(200).json({
      user,
      favoritedRecipes,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ error: "Server error fetching user profile" })
  }
}

const getEditUserProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    )

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.status(200).json({
      message: "User data for editing fetched successfully",
      user,
    })
  } catch (error) {
    console.error("Error fetching user data for editing:", error)
    res.status(500).json({ error: "Server error fetching user data" })
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params
    const { username, gender, email } = req.body

    let user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    //check if email exist
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ error: "Email is already in use" })
      }
      user.email = email
    }

    //update image if user upload
    let imagePath = user.image
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`
    }

    user.username = username || user.username
    user.gender = gender || user.gender
    user.image = imagePath

    const updatedUser = await user.save()

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    res.status(500).json({ error: "Server error updating profile" })
  }
}

module.exports = {
  getUserProfile,
  getEditUserProfile,
  updateUserProfile,
}
