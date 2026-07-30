const Post = require('../models/Post')
const asyncHandler = require('../utils/asyncHandler')

// Nayi blog post create karta hai
const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body

  // UPGRADE (v2): author ab frontend se bheja hua naam nahi (jo koi bhi spoof kar sakta tha),
  // balki token se verify hue logged-in user ki actual ID hai.
  const post = await Post.create({
    title,
    content,
    author: req.user._id,
    // multer se aayi file (agar upload ki gayi ho) ka path save karo
    image: req.file ? `/uploads/${req.file.filename}` : null
  })

  // populate karke frontend ko turant author ka naam bhi bhej do (dubara fetch na karna pade)
  await post.populate('author', 'name email')

  res.status(201).json({ message: 'new post created', post })
})

// Database se posts laata hai - ab pagination aur search ke saath
const getAllPosts = asyncHandler(async (req, res) => {
  // ?page=1&limit=5&search=react jaisa query aayega
  const page = Math.max(parseInt(req.query.page) || 1, 1)
  const limit = Math.min(parseInt(req.query.limit) || 5, 50) // max 50/page (abuse se bachne ke liye)
  const skip = (page - 1) * limit

  // Agar search query di hai to text index use karke match karo, warna sab posts
  const filter = req.query.search
    ? { $text: { $search: req.query.search } }
    : {}

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name email') // sirf name/email chahiye, password to hai hi nahi is model me
      .sort({ createdAt: -1 }) // naye posts sabse upar
      .skip(skip)
      .limit(limit),
    Post.countDocuments(filter)
  ])

  res.status(200).json({
    posts,
    page,
    totalPages: Math.ceil(total / limit),
    totalPosts: total
  })
})

// Ek specific author ke saare posts (Profile page ke liye)
const getPostsByAuthor = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.params.authorId })
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
  res.status(200).json(posts)
})

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) {
    return res.status(404).json({ message: 'Post not found' })
  }

  // OWNERSHIP CHECK (v2) - sirf post ka owner hi usko edit kar sakta hai
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this post' })
  }

  post.title = req.body.title ?? post.title
  post.content = req.body.content ?? post.content
  if (req.file) {
    post.image = `/uploads/${req.file.filename}`
  }

  const updated = await post.save()
  await updated.populate('author', 'name email')

  res.status(200).json(updated)
})

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) {
    return res.status(404).json({ message: 'Post not found' })
  }

  // OWNERSHIP CHECK (v2) - sirf post ka owner hi usko delete kar sakta hai
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this post' })
  }

  await post.deleteOne()
  res.status(200).json({ message: 'Post deleted' })
})

// Naya: Like/Unlike toggle karta hai
const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) {
    return res.status(404).json({ message: 'Post not found' })
  }

  const userId = req.user._id.toString()
  const alreadyLiked = post.likes.some((id) => id.toString() === userId)

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId)
  } else {
    post.likes.push(req.user._id)
  }

  await post.save()
  res.status(200).json({ likesCount: post.likes.length, liked: !alreadyLiked })
})

module.exports = { createPost, getAllPosts, getPostsByAuthor, updatePost, deletePost, toggleLike }
