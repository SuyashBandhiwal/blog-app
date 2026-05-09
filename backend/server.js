// dotenv → .env file ko server.js mein use karne deta hai
const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err))

  app.use('/api/auth', authRoutes)

  app.use('/api/posts', postRoutes)

app.get('/', (req, res) => {
  res.send('Blog API Running')
})

app.listen(5000, () => {
  console.log('Server running')
})