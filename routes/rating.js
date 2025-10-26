const router = require("express").Router()
const ratingCtrl = require("../controllers/rating")

router.get("/", ratingCtrl.getRating)
router.post("/:recipeId", ratingCtrl.createRating)
router.put("/:recipeId/:ratingId", ratingCtrl.updateRating)
router.delete("/:recipeId/:ratingId", ratingCtrl.deleteRating)

module.exports = router
