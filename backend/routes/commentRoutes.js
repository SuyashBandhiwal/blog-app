const express = require('express')
const router = express.Router()
const { getCommentsForPost, addComment, deleteComment } = require('../controllers/commentController')
const { protect } = require('../middleware/authMiddleware')

// Comments nested hain post ke andar: /api/posts/:postId/comments
router.get('/:postId/comments', getCommentsForPost)
router.post('/:postId/comments', protect, addComment)
router.delete('/comments/:id', protect, deleteComment)

module.exports = router
