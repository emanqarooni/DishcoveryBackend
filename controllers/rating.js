const Rating = require("../models/Rating")
const Recipe = require("../models/Recipe")

exports.getRating = async (req, res) => {
  try {
    const ratings = await Rating.find({ recipeId: req.params.recipeId })
    res.status(200).json(ratings)
  } catch (error) {
    res.status(500).json({ msg: "Error fetching ratings", error })
  }
}

exports.createRating = async (req, res) => {
  try {
    const rating = {
      ...req.body,
      recipeId: req.params.recipeId,
      userId: req.body.userId,
      // userId: req.user.id,
    }
    const newRating = await Rating.create(rating)

    await Recipe.findByIdAndUpdate(req.params.recipeId, {
      $push: { ratings: newRating._id },
    })
    res.json(newRating)
  } catch (error) {
    res.status(500).send({ msg: "Error creating new rating!", error })
  }
}

exports.updateRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.ratingId)

    const updateRating = await Rating.findByIdAndUpdate(
      req.params.ratingId,
      req.body,
      { new: true }
    )
    res.status(200).send(updateRating)
  } catch (error) {
    res.status(500).send({ msg: "Error updating the rating!", error })
  }
}

exports.deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.ratingId)

    await Recipe.findByIdAndUpdate(rating.recipeId, {
      $pull: { ratings: req.params.ratingId },
    })

    await Rating.deleteOne({ _id: req.params.ratingId })
    res.status(200).send({ msg: "Rating Deleted", id: req.params.ratingId })
  } catch (error) {
    res.status(500).send({ msg: "Error deleting the recipe!", error })
  }
}
