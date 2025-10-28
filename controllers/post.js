const Post=require("../models/Post")
const Comment=require("../models/Comment")
const path = require("path")

//Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("owner", "username email")
      .populate({ path: "comments", populate: { path: "owner", select: "username email" } })

      const userId = res.locals.payload?.id
      const postsWithLikesCount = posts.map(post => {
        const obj = post.toObject()
        obj.likesCount = post.likes.length
        obj.likedByUser = userId ? post.likes.some(id=>id.toString()===userId) : false
        delete obj.likes
        return obj
      })

      postsWithLikesCount.sort((a,b)=> b.likesCount - a.likesCount)
      res.status(200).send(postsWithLikesCount)
    } catch (error) {
    res.status(500).send({ msg: "Error getting all posts!", error })
  }
}

//Create a new post
const createPost=async(req,res)=>{
  try{
    const ownerId =res.locals.payload.id // user id from token
    const {description,challengeMonth}=req.body

    const existingPost=await Post.findOne({owner:ownerId,challengeMonth})
    if(existingPost){
      return res.status(400).send({msg:"You have already posted for this challenge!"})
    }

    const image=req.file?`/uploads/${req.file.filename}`:null

    const newPost=await Post.create({image,description:req.body.description,owner:ownerId,challengeMonth})

    const populatedPost = await Post.findById(newPost._id)
      .populate("owner", "username email")
      .populate({path: "comments",populate: { path: "owner", select: "username email" }
      })

      res.status(200).send(populatedPost)
  }catch(error){
    res.status(500).send({msg:"Error creating post!",error})
  }
}

//Delete post
const deletePost=async(req,res)=>{
  try{
    const post=await Post.findById(req.params.id)
    if(!post) return res.status(404).send({msg:"Post not found!"})

      if(post.owner.toString()!== res.locals.payload.id){
        return res.status(403).send({msg:"Not authorized!"})
      }
      await post.deleteOne()
      res.status(200).send({ msg: "Post deleted successfully!" })
      } catch (error) {
        res.status(500).send({ msg: "Error deleting post!", error })
  }
}

//Like post
const likePost = async (req, res) => {
  try {
    // التحقق من وجود postId
    if (!req.params.id) {
      return res.status(400).send({ msg: "Post ID is required!" })
    }

    const userId = res.locals.payload.id;
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).send({ msg: "Post not found!" })

    const alreadyLiked = post.likes.includes(userId)

    if (alreadyLiked) {
      post.likes.pull(userId)
    } else {
      post.likes.push(userId)
    }

    await post.save()

    res.status(200).send({
      msg: alreadyLiked ? "Post unliked!" : "Post liked!",
      likesCount: post.likes.length,
      likedByUser: !alreadyLiked
    })
  } catch (error) {
    console.error("Like post error:", error)
    res.status(500).send({ msg: "Error liking post!", error: error.message })
  }
}

module.exports={
  getAllPosts,
  createPost,
  deletePost,
  likePost,
}
