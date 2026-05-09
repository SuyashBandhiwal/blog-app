const Post = require('../models/Post')
const createPost = async (req, res) => {
  const { title, content, author } = req.body
  const post = new Post({ title, content, author })
  await post.save()
  res.status(201).json({ message: 'new post created', post })
}

const getAllPosts = async (req, res) => {
  const posts = await Post.find()
  res.status(200).json(posts)
}

const updatePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.status(200).json(post)
}

const deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id)
  res.status(200).json({ message: 'Post deleted' })
}

module.exports = { createPost , getAllPosts , updatePost, deletePost }