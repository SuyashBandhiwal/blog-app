const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{type: String, required: true },
    email:{type: String, required: true },
    password:{type: String, required: true }
})
// mongoose.model() → schema se collection banata h
// module.exports → file ko bahar use karne deta hai
const User = mongoose.model('User', userSchema)
    module.exports = User