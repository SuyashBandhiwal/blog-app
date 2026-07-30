// Routes = Reception desk → request kahan bhejni hai
// Controller = Manager → actual kaam handle karta hai
// Model = Database ka structure → data kaisa dikhega
// Middleware = Security/checkpoint → request ko check karta hai

const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')            // security headers (v2)
const cookieParser = require('cookie-parser') // httpOnly cookie parse karne ke liye (v2)

const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes') // naya (v2)
const helloRoutes = require('./routes/helloRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware') // naya (v2)

const app = express()

// helmet - common security headers set karta hai (XSS, clickjacking, sniffing se basic protection)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

// UPGRADE (v2): CORS ab sirf apne frontend ke origin ko allow karta hai (pehle `*` tha - koi bhi
// website request bhej sakti thi). `credentials: true` zaroori hai taaki httpOnly cookie
// cross-origin request ke saath bhi bhej/receive ki ja sake.
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())
app.use(cookieParser()) // req.cookies available karwata hai (authMiddleware isse token padhta hai)

// Uploaded images ko publicly serve karta hai: http://localhost:5000/uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err))

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/posts', commentRoutes) // /api/posts/:postId/comments
app.use('/api/hello', helloRoutes)

app.get('/', (req, res) => {
  res.send('Blog API Running')
})

// UPGRADE (v2): centralized error handling - ye do middleware HAMESHA sabse aakhri me aane chahiye
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
