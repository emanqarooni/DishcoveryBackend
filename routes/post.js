const express=require("express")
const router=express.Router()

const post=require("../controllers/post")
const { stripToken, verifyToken } = require("../middleware/index")
const upload = require("../middleware/upload")

//View all posts
router.get("/", stripToken, verifyToken, post.getAllPosts)
//View single post
router.get("/:id", stripToken, verifyToken,post.getPostById)
// Add new post
router.post("/", stripToken, verifyToken, upload.single("image"), post.createPost)
//Delete post
router.delete("/:id",stripToken, verifyToken, post.deletePost)
//Like post
router.post("/:id/like", stripToken, verifyToken, post.likePost)

module.exports=router

