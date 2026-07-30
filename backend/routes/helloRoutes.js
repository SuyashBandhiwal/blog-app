const express = require('express')
const router = express.Router()

// Humne controller function yahi direct bana diya, ab external file nahi chahiye
const getHelloWorld = (req, res) => {
  res.json({ message: "Hello World from SyntaxShare Backend!" })
}

// GET request to /api/hello
router.get('/', getHelloWorld)

module.exports = router