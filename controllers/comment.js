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

//Edit comment
const editComment=async(req,res)=>{
  try{
    const commentId = req.params.id
    const userId = res.locals.payload.id
    const { comment: newText } = req.body

    const existingComment = await Comment.findById(commentId)
    if (!existingComment) return res.status(404).send({msg:"Comment not found!"})

    if (existingComment.owner.toString() !== userId)
    return res.status(403).send({msg:"Not authorized!"})

    existingComment.comment = newText
    await existingComment.save()

    const populatedComment = await Comment.findById(existingComment._id).populate("owner", "username email")

      res.status(200).send(populatedComment)
  }catch(error){
    res.status(500).send({msg:"Error editing comment!", error})
  }
}

module.exports={
  addComment,
  editComment,
}
