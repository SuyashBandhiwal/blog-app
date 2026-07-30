const express = require('express')
const rateLimit = require('express-rate-limit')
const router = express.Router()
const { register, login, logout, getMe } = require('../controllers/authController')
const { registerRules, loginRules } = require('../validators/authValidators')
const { protect } = require('../middleware/authMiddleware')

// Naya (v2): brute-force login attempts se bachne ke liye rate limiter.
// 10 minute me sirf 10 attempts allow, uske baad 429 (Too Many Requests) milega
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  message: { message: 'Too many attempts, please try again after some time' },
  standardHeaders: true,
  legacyHeaders: false
})

router.post('/register', authLimiter, registerRules, register)
router.post('/login', authLimiter, loginRules, login)
router.post('/logout', logout)
// /me - current logged-in user check karne ke liye (protect middleware pehle chalega)
router.get('/me', protect, getMe)

module.exports = router
