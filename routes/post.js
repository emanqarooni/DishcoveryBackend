const express=require("express")
const router=express.Router()

const post=require("../controllers/post")
const { stripToken, verifyToken } = require("../middleware/index")
const upload = require("../middleware/upload")

//View all posts
router.get("/",post.getAllPosts)
//View single post
router.get("/:id",post.getPostById)
// Add new post
router.post("/", stripToken, verifyToken, upload.single("image"), post.createPost)
//Delete post
router.delete("/:id",stripToken, verifyToken, post.deletePost)


module.exports=router





