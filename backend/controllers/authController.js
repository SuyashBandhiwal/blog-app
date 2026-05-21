// User model ko import karta hai -user me kya-kya save hoga(name,email,password)
const User = require('../models/User')
// Passwords ko encrypt/hash karta hai - Password ko unreadable bana deta hai (123456 -$2a$10$ksjdfhksjdfh...)
//Database me real password save nahi hota - Encrypted version save hota hai
const bcrypt = require('bcryptjs')
// JWT package import karta hai - Login ke baad user ko ek token diya jata hai (JWT = JSON Web Token)
const jwt = require('jsonwebtoken')

// Ye register function bana raha hai - Ye function kab chalega -Jab request aayegi: /api/auth/register
// async kyu lagaya - Kyuki database operations time lete hain (user find karna,user save karna)
const register = async (req, res) => {
  // Frontend se aaya data nikal raha hai
  const { name, email, password } = req.body
// Database me check karta hai ki:is email se user already exist karta hai ya nahi
  const existingUser = await User.findOne({ email })
//matlab user already database me hai
  if (existingUser) {
    // Frontend ko error bhejta hai -same email se dobara register kar rahe ho
    // return kyu lagaya? - Taaki function wahi stop ho jaye
    return res.status(400).json({
      message: 'User already exists'
    })
  }

  // Password ko aur secure banane ke liye extra random text add karta hai
  // Salt ek random extra security layer hoti hai
  // 10 kya hai? - Ye salt rounds hain (Matlab hashing kitni strong hogi) - Bigger number(more secure but slower)
  const salt = await bcrypt.genSalt(10)
  // Original password ko encrypted/hash me convert karta hai
  const hashedPassword = await bcrypt.hash(password, salt)
  //Ek new user ready kar rahe ho database me save karne ke liye
  const user = new User({
    name,
    email,
    password: hashedPassword
  })
  // User ko database me save karta hai
  await user.save()
  // Frontend ko success response bhejta hai
  res.status(201).json({
    message: 'User registered successfully'
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    })
  }
  // Check karta hai: frontend se aaya password == database me stored hashed password
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(400).json({
      message: 'Incorrect password'
    })
  }
  // JWT token generate karta ha - "Ye banda successfully login hai"
  const token = jwt.sign(
    //Token ke andar user ki ID store karta hai
    { id: user._id },
    // Secret key use karta hai token banane ke liye
    process.env.JWT_SECRET,
    //7 days ke baad token invalid ho jayega.
    { expiresIn: '7d' }
  )
  //Frontend ko token bhejta ha - 200 (Success)
  res.status(200).json({
    token
  })
}
//register aur login functions export karta hai
module.exports = { register, login }