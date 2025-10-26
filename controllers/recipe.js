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

exports.toggleFavRecipe = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const recipe = await Recipe.findById(req.params.recipeId)

    if (!recipe) {
      return res.status(404).send({ msg: "Recipe not found!" })
    }

    const alreadyFavorited = recipe.favouritedByUsers.includes(userId)

    if (alreadyFavorited) {
      recipe.favouritedByUsers.pull(userId)
      await recipe.save()
      return res.status(200).send({
        msg: "Recipe removed from favorites!",
        isFavorited: false,
        favoritesCount: recipe.favouritedByUsers.length,
      })
    } else {
      recipe.favouritedByUsers.push(userId)
      await recipe.save()
      return res.status(200).send({
        msg: "Recipe added to favorites!",
        isFavorited: true,
        favoritesCount: recipe.favouritedByUsers.length,
      })
    }
  } catch (error) {
    res.status(500).send({ msg: "Error adding recipe to fav list!", error })
  }
}

exports.checkFavStatus = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const recipe = await Recipe.findById(req.params.recipeId)

    if (!recipe) {
      return res.status(404).send({ msg: "Recipe not found!" })
    }

    const isFavorited = recipe.favouritedByUsers.includes(userId)

    res.status(200).send({
      isFavorited,
      favoritesCount: recipe.favouritedByUsers.length,
    })
  } catch (error) {
    res.status(500).send({ msg: "Error checking favorite status!", error })
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
