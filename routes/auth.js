const router = require("express").Router()
const controller = require("../controllers/auth")
const middleware = require("../middleware")
const upload = require("../middleware/upload")

router.post("/register", upload.single("image"), controller.Register)
router.post("/login", controller.Login)
router.put(
  "/update/:id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdatePassword
)
router.get(
  "/session",
  middleware.stripToken,
  middleware.verifyToken,
  controller.CheckSession
)

//forgetting pass routes
router.post("/forgot-password", controller.ForgetPassword)
router.post("/reset/:token", controller.ResetPassword)

module.exports = router
