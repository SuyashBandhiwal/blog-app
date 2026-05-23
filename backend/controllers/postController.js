const Post = require('../models/Post')
// Nayi blog post create karta hai
const createPost = async (req, res) => {
  // Frontend se bheja data nikalta hai
  const { title, content, author } = req.body
  const post = new Post({ title, content, author })
  await post.save()
  res.status(201).json({ message: 'new post created', post })
}
// Database se saari posts laata hai
const getAllPosts = async (req, res) => {
  const posts = await Post.find()
  res.status(200).json(posts)
}

const updatePost = async (req, res) => {
  // Specific post ko ID se dhundkar update karta hai
  const post = await Post.findByIdAndUpdate(
    // URL se ID leta hai - URL:/api/posts/123 ( 123 = req.params.id )
    req.params.id, 
    // Updated data leta hai
    req.body,
    // Updated wala latest document return karta hai
    { new: true }
  )
  // Updated post frontend ko bhejta hai
  res.status(200).json(post)
}

const deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id)
  res.status(200).json({ message: 'Post deleted' })
}
//Saare controller functions export karta hai
module.exports = { createPost , getAllPosts , updatePost, deletePost }