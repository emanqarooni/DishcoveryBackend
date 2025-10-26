const router = require("express").Router()
const userController = require("../controllers/user")
const upload = require("../middleware/upload")
const middleware = require("../middleware")

//get profile with favorites
router.get(
  "/:userId",
  middleware.stripToken,
  middleware.verifyToken,
  userController.getUserProfile
)

//get only user info for edit
router.get(
  "/:userId/edit",
  middleware.stripToken,
  middleware.verifyToken,
  userController.getEditUserProfile
)

//update user info
router.put(
  "/:userId",
  middleware.stripToken,
  middleware.verifyToken,
  upload.single("image"),
  userController.updateUserProfile
)

module.exports = router
