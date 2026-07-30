// JWT package import karta hai
// JWT = JSON Web Token (Ye ek secret identity card hota hai)
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')

// Ye middleware function hai -Request ko controller tak jane se pehle check karta hai
// UPGRADE (v2): token ab localStorage/header ki jagah httpOnly cookie se aata hai.
// Cookie me se token nikalna XSS-safe hai kyuki JS (client-side) cookie ko read nahi kar sakti.
const protect = asyncHandler(async (req, res, next) => {
  // Pehle httpOnly cookie check karo (naya, secure tareeka)
  let token = req.cookies?.token

  // Backward-compatible fallback: agar koi purane Authorization header se bhej raha hai
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  // !token - token nahi hai
  // 401 - Unauthorized user (Pehle login karo)
  if (!token) {
    return res.status(401).json({
      message: 'Not authorized, no token'
    })
  }

  try {
    // Token ko verify karta hai -token asli hai ya fake, secret key sahi hai ya nahi
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Sirf token ka data trust karne ki jagah, DB se fresh user nikalte hain
    // (password field ko explicitly exclude kiya - kabhi bhi client ko nahi jana chahiye)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' })
    }

    // req.user me poora user object (minus password) store - controllers isse use karenge
    req.user = user
    next()
  } catch (err) {
    // Token expired ya tampered hua
    return res.status(401).json({ message: 'Not authorized, token failed' })
  }
})

module.exports = { protect }
