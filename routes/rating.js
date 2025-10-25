const router = require('express').Router()
const ratingCtrl = require('../controllers/rating')

router.get('/:recipeId/:userId',ratingCtrl.createRating)
router.put('/recipeId/:userId/:ratingId',ratingCtrl.updateRating)
router.put('/recipeId/:ratingId',ratingCtrl.deleteRating)

module.exports = router
