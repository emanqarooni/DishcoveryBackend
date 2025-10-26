const Recipe = require("../models/Recipe")

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.find({})
    res.status(200).send(recipe)
  } catch (error) {
    res.status(500).send({ msg: "Error fetching recipe!", error })
  }
}

exports.getDetails = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate(
      "ratings"
    )
    res.status(200).send(recipe)
  } catch (error) {
    res.status(500).send({ msg: "Error fetching recipe!", error })
  }
}

exports.favRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndUpdate(req.params.recipeId, {
      $push: { favouritedByUsers: req.body.userId },
    })
  } catch (error) {
    res.status(500).send({ msg: "Error adding recipe to fav list!", error })
  }
}

exports.favRecipeDelete = async (req, res) => {
  try {
    await Recipe.findByIdAndUpdate(req.params.recipeId, {
      $pull: { favouritedByUsers: req.body.userId },
    })

    await Rating.deleteOne({ _id: req.body.userId })
  } catch (error) {
    res.status(500).send({ msg: "Error adding recipe to fav list!", error })
  }
}

exports.createRecipe = async (req, res) => {
  try {
    const image = req.file ? `uploads/${req.file.filename}` : req.body.image
    const newRecipe = await Recipe.create({ ...req.body, image: image })
    res.json(newRecipe)
  } catch (error) {
    res.status(500).send({ msg: "Error creating new recipe!", error })
  }
}

exports.deleteRecipe = async (req, res) => {
  try {
    await Recipe.deleteOne({ _id: req.params.recipeId })
    res.status(200).send({ msg: "Recipe Deleted", id: req.params.recipeId })
  } catch (error) {
    res.status(500).send({ msg: "Error deleting the recipe!", error })
  }
}

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.recipeId,
      req.body,
      { new: true }
    )
    res.status(200).send(recipe)
  } catch (error) {
    res.status(500).send({ msg: "Error updating the recipe!", error })
  }
}
