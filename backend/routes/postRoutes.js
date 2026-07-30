const express = require('express')
const router = express.Router()
const {
  createPost,
  getAllPosts,
  getPostsByAuthor,
  updatePost,
  deletePost,
  toggleLike
} = require('../controllers/postController')
const { protect } = require('../middleware/authMiddleware')
const { postRules } = require('../validators/postValidators')
const upload = require('../middleware/upload')

// Create - login zaroori, image optional (multer 'image' field se), validation bhi
router.post('/', protect, upload.single('image'), postRules, createPost)

// Sab posts - koi bhi dekh sakta hai (public feed), ?page=&limit=&search= support karta hai
router.get('/', getAllPosts)

// Ek specific user ke posts (Profile page)
router.get('/user/:authorId', getPostsByAuthor)

// Update/Delete - login + OWNERSHIP check (controller ke andar hota hai)
router.put('/:id', protect, upload.single('image'), postRules, updatePost)
router.delete('/:id', protect, deletePost)

// Like/unlike toggle
router.put('/:id/like', protect, toggleLike)

module.exports = router
