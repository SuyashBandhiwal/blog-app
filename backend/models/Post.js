const mongoose = require('mongoose')
// Schema - database me data kis format me save hoga
const postSchema = new mongoose.Schema({
  //type: String - title text/string hona chahiye ,required: true - title compulsory hai
  title  :   { type: String, required: true, trim: true },
  content:   { type: String, required: true },
  // UPGRADE (v2): author ab plain string nahi, User document ka reference (ObjectId) hai.
  // Isse `.populate('author')` karke real user ki details (name, email) nikal sakte hain,
  // aur ownership check (post.author.toString() === req.user._id) reliable ban jata hai.
  author :   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Optional image - multer se upload hoke yahan uska path/URL store hoga
  image  :   { type: String, default: null },
  // Likes - kis-kis user ne like kiya, uske ObjectIds ka array
  likes  :   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true }) // createdAt add hone se "Just now" wali hardcoded string hata sakte hain

// Title aur content pe text index - $text search (Tier 2 ka search feature) ke liye zaroori
postSchema.index({ title: 'text', content: 'text' })

const Post = mongoose.model('Post', postSchema)
module.exports = Post
