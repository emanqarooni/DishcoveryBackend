const router = require("express").Router()
const userController = require("../controllers/user")
const upload = require("../middleware/upload")

//get profile with favorites
router.get("/:userId", userController.getUserProfile)

//get only user info for edit
router.get("/:userId/edit", userController.getEditUserProfile)

//update user info
router.put("/:userId", upload.single("image"), userController.updateUserProfile)

module.exports = router
