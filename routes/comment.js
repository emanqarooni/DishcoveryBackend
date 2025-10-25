const express=require("express")
const router=express.Router()

const comment=require("../controllers/comment")
const { stripToken, verifyToken } = require("../middleware/index")

//Add a new comment
router.post("/",stripToken, verifyToken,comment.addComment)
//Edit a comment
router.put("/:id",stripToken, verifyToken,comment.editComment)

module.exports=router
