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

module.exports={
  getAllPosts,
}
