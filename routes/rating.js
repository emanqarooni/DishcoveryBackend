const router = require("express").Router()
const ratingCtrl = require("../controllers/rating")
const middleware = require("../middleware")

router.get(
  "/:recipeId",
  middleware.stripToken,
  middleware.verifyToken,
  ratingCtrl.getRating
)
router.post(
  "/:recipeId",
  middleware.stripToken,
  middleware.verifyToken,
  ratingCtrl.createRating
)
router.put(
  "/:recipeId/:ratingId",
  middleware.stripToken,
  middleware.verifyToken,
  ratingCtrl.updateRating
)
router.delete(
  "/:recipeId/:ratingId",
  middleware.stripToken,
  middleware.verifyToken,
  ratingCtrl.deleteRating
)

module.exports = router
