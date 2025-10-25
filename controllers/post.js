const Post=require("../models/Post")

//Get all posts
const getAllPosts=async(req,res)=>{
  try{
    const posts=await Post.find({}).populate("owner","username email")
    res.status(200).send(posts)
  }catch(error){
    res.status(500).send({msg:"Error getting all posts!",error})
  }
}

//Get single post by id
const getPostById=async(req,res)=>{
  try{
    const post=await Post.findById(req.params.id).populate("owner","username email")
    if(!post) return res.status(404).send({msg:"Post not found !"})
      res.status(200).send(post)
  }catch(error){
    res.status(500).send({msg:"Error getting post!",error})
  }
}

//Create a new post
const createPost=async(req,res)=>{
  try{
    const ownerId =res.locals.payload.id // user id from token
    const image=req.file?`/uploads/${req.file.filename}`:null

    const newPost=await Post.create({
      image,
      description:req.body.description,
      owner:ownerId,
    })

    res.status(200).send(newPost)
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
const likePost=async(req,res)=>{
  try{
    const post=await Post.findById(req.params.id)
    if(!post)return res.status(404).send({ msg: "Post not found!" })

      post.likes +=1
      await post.save()

      res.status(200).send({ msg: "Post liked!", likes: post.likes })
    } catch (error) {
    res.status(500).send({ msg: "Error liking post!", error })
  }
  }


module.exports={
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  likePost,
}
