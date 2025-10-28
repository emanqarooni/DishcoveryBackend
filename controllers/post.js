const Post = require("../models/Post")
const Comment = require("../models/Comment")
const path = require("path")

//Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("owner", "username email")
      .populate({
        path: "comments",
        populate: { path: "owner", select: "username email _id" },
      })

    const userId = res.locals.payload?.id
    const postsWithLikesCount = posts.map((post) => {
      const obj = post.toObject()
      obj.likesCount = post.likes.length
      obj.likedByUser = userId
        ? post.likes.some((id) => id.toString() === userId)
        : false
      return obj
    })

    postsWithLikesCount.sort((a, b) => b.likesCount - a.likesCount)
    res.status(200).send(postsWithLikesCount)
  } catch (error) {
    res.status(500).send({ msg: "Error getting all posts!", error })
  }
}

//Create a new post
const createPost = async (req, res) => {
  try {
    const ownerId = res.locals.payload.id // user id from token
    const { description, challengeMonth } = req.body

    const existingPost = await Post.findOne({ owner: ownerId, challengeMonth })
    if (existingPost) {
      return res
        .status(400)
        .send({ msg: "You have already posted for this challenge!" })
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null

    const newPost = await Post.create({
      image: image,
      description: req.body.description,
      owner: ownerId,
      challengeMonth,
    })

    const populatedPost = await Post.findById(newPost._id)
      .populate("owner", "username email")
      .populate({
        path: "comments",
        populate: { path: "owner", select: "username email _id" },
      })

    res.status(200).send(populatedPost)
  } catch (error) {
    res.status(500).send({ msg: "Error creating post!", error })
  }
}


//Like post
const likePost = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const post = await Post.findById(req.params.id)
    const alreadyLiked = post.likes.includes(userId)
    if (!post) return res.status(404).send({ msg: "Post not found!" })

    if (alreadyLiked) {
      post.likes.pull(userId)
    } else {
      post.likes.push(userId)
    }

    await post.save()

    const updatePost = await Post.findById(req.params.id)
      .populate("owner", "username email")
      .populate({
        path: "comments",
        populate: { path: "owner", select: "username email" },
      })

    res.status(200).send(updatePost)
  } catch (error) {
    console.error("Like post error:", error)
    res.status(500).send({ msg: "Error liking post!", error: error.message })
  }
}

module.exports = {
  getAllPosts,
  createPost,
  likePost,
}
