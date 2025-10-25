const Rating = require("../models/Rating")

exports.createRating = async (req, res) => {
  try {
    req.body.recipeId = req.params.recipeId
    req.body.userId = req.params.userId
    const newRating = Rating.create(req.body)
    res.json(newRating)
  } catch (error) {
    res.status(500).send({ msg: "Error creating new rating!", error })
  }
}

exports.updateRating = async (req, res) => {
  try {
    req.body.recipeId = req.params.recipeId
    req.body.userId = req.params.userId
    const updateRating = await Rating.findByIdAndUpdate(
      req.params.ratingId,
      req.body
    )
    res.status(200).send(updateRating)
  } catch (error) {
    res.status(500).send({ msg: "Error updating the rating!", error })
  }
}

exports.deleteRating = async (req, res) => {
  try {
    await Rating.deleteOne({ _id: req.params.ratingId })
    res.status(200).send({ msg: "Rating Deleted", id: req.params.recipeId })
  } catch (error) {
    res.status(500).send({ msg: "Error deleting the recipe!", error })
  }
}
