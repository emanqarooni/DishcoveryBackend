const {Post}=require("../models")

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

module.exports={
  getAllPosts,
  getPostById,
}
