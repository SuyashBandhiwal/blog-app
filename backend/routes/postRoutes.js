const express = require('express')
//Ek mini router banata hai jo sirf posts wale routes handle karega
const router = express.Router()
// createPost -nayi post banana, getAllPosts - saari posts lana
const { createPost, getAllPosts, updatePost, deletePost } = require('../controllers/postController')
// Route bas request receive karta hai, Actual kaam controller karta hai 
// Ye middleware import kar raha hai
const { protect } = require('../middleware/authMiddleware')
//Pehle middleware chalega -Ye check karega:user logged in hai? or token valid hai?- agar valid huha tho hi createPost chalega -Actual database me post save karega
router.post('/', protect, createPost)
//Saari blog posts fetch karta hai
// koi bhi posts dekh sakta hai
router.get('/', getAllPosts)
// Specific post update karta hai
router.put('/:id', protect, updatePost)
// Specific post delete karta hai
router.delete('/:id', protect, deletePost)

module.exports = router