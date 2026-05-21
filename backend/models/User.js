const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{type: String, required: true },
    email:{type: String, required: true },
    password:{type: String, required: true }
})
// MongoDB me "User" naam ka model/collection banao using userSchema structure
// module.exports → file ko bahar use karne deta hai
const User = mongoose.model('User', userSchema)
    module.exports = User
    