const express=require("express")
const router=express.Router()

const post=require("../controllers/post")

//View all posts
router.get("/",post.getAllPosts)
//View single post
router.get("/:id",post.getPostById)




module.exports=router
