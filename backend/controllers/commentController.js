const Comment = require('../models/Comment')
const asyncHandler = require('../utils/asyncHandler')

// Ek post ke saare comments laata hai (koi bhi dekh sakta hai, login zaroori nahi)
const getCommentsForPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'name')
    .sort({ createdAt: -1 })
  res.status(200).json(comments)
})

// Naya comment add karta hai (login zaroori hai - route pe `protect` lagega)
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Comment text is required' })
  }

  const comment = await Comment.create({
    post: req.params.postId,
    author: req.user._id,
    text: text.trim()
  })

  await comment.populate('author', 'name')
  res.status(201).json(comment)
})

// Comment delete karta hai - sirf jisne likha wahi delete kar sakta hai
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' })
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this comment' })
  }

  await comment.deleteOne()
  res.status(200).json({ message: 'Comment deleted' })
})

module.exports = { getCommentsForPost, addComment, deleteComment }
