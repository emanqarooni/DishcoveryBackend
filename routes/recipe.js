const router = require("express").Router()
const recipeCtrl = require("../controllers/recipe")
const upload = require("../middleware/upload")
const middleware = require("../middleware")

router.get(
  "/",
  middleware.stripToken,
  middleware.verifyToken,
  recipeCtrl.getRecipe
)
router.get(
  "/:recipeId",
  middleware.stripToken,
  middleware.verifyToken,
  recipeCtrl.getDetails
)
router.post(
  "/createRecipe",
  middleware.stripToken,
  middleware.verifyToken,
  upload.single("image"),
  recipeCtrl.createRecipe
)
router.put(
  "/:recipeId",
  middleware.stripToken,
  middleware.verifyToken,
  recipeCtrl.updateRecipe
)
router.delete(
  "/:recipeId",
  middleware.stripToken,
  middleware.verifyToken,
  recipeCtrl.deleteRecipe
)

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
module.exports = router
