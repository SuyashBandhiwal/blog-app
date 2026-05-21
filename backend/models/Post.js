const mongoose = require('mongoose')
// Schema - database me data kis format me save hoga
const postSchema = new mongoose.Schema({
  //type: String - title text/string hona chahiye ,required: true - title compulsory hai
  // Agar required hata diya - to empty data bhi save ho sakta hai
  title  :   { type: String, required: true },
  content:   { type: String, required: true },
  author :   { type: String, required: true }
}) 

const Post = mongoose.model('Post', postSchema)
module.exports = Post 