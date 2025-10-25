const Comment=require("../models/Comment")

//Add a comment
const addComment=async(req,res)=>{
  try{
    const userId=res.locals.payload.id
    const {comment}=req.body

    if(!comment)return res.status(400).send({msg:"Comment is required!"})

      const newComment=await Comment.create({
        owner:userId,
        comment,
      })

      const populatedComment=await Comment.findById(newComment._id).populate("owner","username email")

      res.status(200).send(populatedComment)
  }catch(error){
      console.error("Error adding comment:", error)
    res.status(500).send({msg:"Error adding comment!",error:error.message})
  }
}

module.exports={
  addComment
}
