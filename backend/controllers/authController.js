// User model ko import karta hai -user me kya-kya save hoga(name,email,password)
const User = require('../models/User')
// Passwords ko encrypt/hash karta hai
const bcrypt = require('bcryptjs')
// JWT package import karta hai
const jwt = require('jsonwebtoken')
const asyncHandler = require('../utils/asyncHandler')

// Token banane wala helper - login aur register dono me reuse hota hai
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// UPGRADE (v2): token ab response body me nahi, httpOnly cookie me bheja jata hai.
// httpOnly cookie ko browser ka JavaScript (localStorage jaisa) read nahi kar sakta -
// isse XSS attack ke through token chori hone ka risk kam ho jata hai.
const sendTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    // production me HTTPS ke through hi cookie bhejo
    secure: process.env.NODE_ENV === 'production',
    // cross-site (alag domain pe deployed frontend/backend) cookie ke liye 'none' zaroori hai
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 din, JWT expiry ke barabar
  })
}

// validation (name/email/password format) ab route-level middleware (authValidators.js) me ho chuki hai
// isliye controller sirf business logic pe focus karta hai
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({ name, email, password: hashedPassword })

  const token = generateToken(user._id)
  sendTokenCookie(res, token)

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: user._id, name: user.name, email: user.email }
  })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({ message: 'Incorrect password' })
  }

  const token = generateToken(user._id)
  sendTokenCookie(res, token)

  res.status(200).json({
    user: { id: user._id, name: user.name, email: user.email }
  })
})

// Naya: logout - cookie ko clear kar deta hai
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: 'Logged out' })
})

// Naya: /api/auth/me - frontend page-refresh pe "kaun login hai" check karne ke liye use hota hai
// (protect middleware pehle chal chuka hoga, isliye req.user already available hai)
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email }
  })
})

module.exports = { register, login, logout, getMe }
