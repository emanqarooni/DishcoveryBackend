const Recipe = require("../models/Recipe")

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.find({}).populate("ratings")
    res.status(200).send(recipe)
  } catch (error) {
    res.status(500).send({ msg: "Error fetching recipe!", error })
  }
}

exports.createRecipe = async (req, res) => {
  try {
    const image = req.file ? `uploads/${req.file.filename}` : ""
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
    const recipe = await Recipe.findByIdAndUpdate( req.params.recipeId, req.body, {new:true} )
    res.status(200).send(recipe)
  } catch (error) {
    res.status(500).send({ msg: "Error updating the recipe!", error })
  }
}
