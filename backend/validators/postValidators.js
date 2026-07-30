const { body, validationResult } = require('express-validator')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg })
  }
  next()
}

const postRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }).withMessage('Title too long (max 150 chars)'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validate
]

module.exports = { postRules }
