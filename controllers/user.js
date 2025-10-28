const User = require("../models/User")
const Recipe = require("../models/Recipe")

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    )

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const favoritedRecipes = await Recipe.find({
      favouritedByUsers: userId,
    }).populate("user", "username email image")

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
    const { username, email, gender } = req.body

    let user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    //validate Gmail address
    const emailVal = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    if (email && !emailVal.test(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid Gmail address." })
    }

    //check if email already used by another user
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email })
      if (existingEmail) {
        return res.status(400).json({ error: "Email is already in use" })
      }
      user.email = email
    }

    //check if username already used by another user
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username })
      if (existingUsername) {
        return res.status(400).json({ error: "Username is already taken" })
      }
      user.username = username
    }

    //validate and update image
    let imagePath = user.image
    if (req.file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
      if (!validTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          error: "Invalid image format. Only JPEG, PNG, or WEBP allowed.",
        })
      }
      imagePath = `/uploads/${req.file.filename}`
    }

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
