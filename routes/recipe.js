const router = require('express').Router()
const recipeCtrl = require('../controllers/recipe')
const upload = require('../middleware/upload')

router.get('/',recipeCtrl.getRecipe)
router.get('/:recipeId',recipeCtrl.getDetails)
router.post('/createRecipe',upload.single('image'),recipeCtrl.createRecipe)
router.put('/:recipeId',recipeCtrl.updateRecipe)
router.delete('/:recipeId', recipeCtrl.deleteRecipe)

module.exports = router
