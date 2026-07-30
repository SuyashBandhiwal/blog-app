const mongoose = require('mongoose')

// Comment ek alag collection hai, post ke andar embed nahi kiya -
// isse comments list badhne par bhi Post document chhota/fast rehta hai (Mongoose best practice)
const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true, maxlength: 500 }
}, { timestamps: true })

// Ek post ke saare comments jaldi fetch karne ke liye index
commentSchema.index({ post: 1, createdAt: -1 })

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment
