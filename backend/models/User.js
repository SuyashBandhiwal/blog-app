const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{type: String, required: true, trim: true },
    email:{type: String, required: true, unique: true, lowercase: true, trim: true },
    password:{type: String, required: true }
}, { timestamps: true }) // createdAt/updatedAt automatically add ho jayenge - profile page pe "joined on" dikhane ke kaam aayega

// MongoDB me "User" naam ka model/collection banao using userSchema structure
// module.exports → file ko bahar use karne deta hai
const User = mongoose.model('User', userSchema)
module.exports = User
