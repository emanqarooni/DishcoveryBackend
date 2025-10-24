const mongoose = require("mongoose")

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
      required: true,
    },
    preparingTime: {
      type: String,
    },
    cookingTime: {
      type: String,
    },
    servings: {
      type: Number,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "European",
        "Healthy",
        "Mexican",
        "Arabic",
        "American",
        "Indian",
        "African",
        "EastAsian",
        "Turkish",
      ],
    },
    favouritedByUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, //createdAt, updatedAt
  }
)

const Recipe = mongoose.model("Recipe", recipeSchema)
module.exports = Recipe
