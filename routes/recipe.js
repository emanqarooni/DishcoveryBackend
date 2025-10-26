<<<<<<< HEAD
const router = require("express").Router()
const recipeCtrl = require("../controllers/recipe")
const upload = require("../middleware/upload")
const middleware = require("../middleware")

router.get("/", recipeCtrl.getRecipe)
router.get("/:recipeId", recipeCtrl.getDetails)
router.post("/createRecipe", upload.single("image"), recipeCtrl.createRecipe)
router.put("/:recipeId", recipeCtrl.updateRecipe)
router.delete("/:recipeId", recipeCtrl.deleteRecipe)

router.post(
  "/:recipeId/toggleFav",
  middleware.stripToken,
  middleware.verifyToken,
  recipeCtrl.toggleFavRecipe
)

router.get(
  "/:recipeId/favStatus",
  middleware.stripToken,
  middleware.verifyToken,
  recipeCtrl.checkFavStatus
)
=======
const router = require('express').Router()
const recipeCtrl = require('../controllers/recipe')
const upload = require('../middleware/upload')

router.get('/',recipeCtrl.getRecipe)
router.get('/:recipeId',recipeCtrl.getDetails)
router.post('/createRecipe',upload.single('image'),recipeCtrl.createRecipe)
router.put('/:recipeId',recipeCtrl.updateRecipe)
router.delete('/:recipeId', recipeCtrl.deleteRecipe)

router.post('/:recipeId/addFav' ,recipeCtrl.favRecipe)
router.delete('/:recipeId/deleteFav', recipeCtrl.favRecipeDelete)
>>>>>>> 20308ea5f62436c0369c490992da8bac85146f4a

module.exports = router
