const { body, validationResult } = require('express-validator')

// Ye function checks ko run karke result nikalta hai. Agar error hai to 400 bhejo,
// warna next() bula ke actual controller (register/login) tak jaane do.
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // Sirf pehla error message bhej rahe hain, taaki frontend pe seedha dikha sakein
    return res.status(400).json({ message: errors.array()[0].msg })
  }
  next()
}

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
]

const loginRules = [
  body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
]

module.exports = { registerRules, loginRules }
