const Comment = require("../models/Comment")
const Post = require("../models/Post")

//Add a comment
const addComment = async (req, res) => {
  try {
    const postId = req.body.postId
    const userId = res.locals.payload.id
    const commentText = req.body.comment

      if (!commentText)
      return res.status(400).send({ msg: "Comment text is required!" })

      const newComment = await Comment.create({ owner: userId,comment: commentText,postId: postId})
      await Post.findByIdAndUpdate(postId,{$push:{comments:newComment._id}
    })
      const populatedComment = await Comment.findById(newComment._id).populate("owner","username email")
      res.status(200).send({msg: "Comment added successfully!",comment: populatedComment,})
  } catch (error) {
    console.error("Error adding comment:", error)
    res.status(500).send({ msg: "Error adding comment!", error: error.message })
  }
}

//Edit comment
const editComment = async (req, res) => {
  try {
    const commentId = req.params.id
    const userId = res.locals.payload.id
    const { comment: newText } = req.body

    const existingComment = await Comment.findById(commentId)
    if (!existingComment)
      return res.status(404).send({ msg: "Comment not found!" })

    if (existingComment.owner.toString() !== userId)
      return res.status(403).send({ msg: "Not authorized!" })

    existingComment.comment = newText
    await existingComment.save()

    const populatedComment = await Comment.findById(
      existingComment._id
    ).populate("owner", "username email")

    res.status(200).send(populatedComment)
  } catch (error) {
    res.status(500).send({ msg: "Error editing comment!", error })
  }
}

//Delete a comment
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id
    const userId = res.locals.payload.id

    const existingComment = await Comment.findById(commentId)
    if (!existingComment)
      return res.status(404).send({ msg: "Comment not found!" })

    if (existingComment.owner.toString() !== userId)
      return res.res.status(403).send({ msg: "Not authorized!" })
    const postId = existingComment.postId
    await Post.findByIdAndUpdate(postId,{
      $pull:{comments: commentId}
    })
    await existingComment.deleteOne()

    res.status(200).send({ msg: "Comment deleted successfully!" })
  } catch (error) {
    res.status(500).send({ msg: "Error deleting comment!", error })
  }
}

//Add reply
const addReply = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) return res.status(404).json({ msg: "Comment not found" })

    const userId = res.locals.payload.id
    const reply = {
      owner: userId,
      comment: req.body.comment,
    }

    comment.replies.push(reply)
    await comment.save()

    const populated = await Comment.findById(comment._id)
      .populate("owner", "username email")
      .populate("replies.owner", "username email")

    res.status(200).json(populated)
  } catch (error) {
    console.error("Error adding reply:", error)
    res.status(500).json({ msg: "Error adding reply", error: error.message })
  }
}


module.exports = {
  addComment,
  editComment,
  deleteComment,
  addReply,
}
