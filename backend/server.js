// Routes = Reception desk → request kahan bhejni hai
// Controller = Manager → actual kaam handle karta hai
// Model = Database ka structure → data kaisa dikhega
// Middleware = Security/checkpoint → request ko check karta hai

// dotenv ek package hai jo .env file ko read karta hai like- MONGO_URI = abcd 
const dotenv = require('dotenv')
// .env ke andar jo variables likhe hote hain unko Node.js application me use karne deta hai
dotenv.config()
// express - server banane ke liye (express ko import kar liya)
const express = require('express')
// mongoose - database (MongoDB) se baat karne ke liye (mongo ko import kar liya)
const mongoose = require('mongoose')
// authRoutes - login aur register ke liye URLs
const authRoutes = require('./routes/authRoutes')
// postRoutes - blog posts ke liye URLs (create, read, update, delete)
const postRoutes = require('./routes/postRoutes')
// helloRoutes - sample Hello World API URLs
const helloRoutes = require('./routes/helloRoutes')
// cors - frontend aur backend ke beech data exchange karne deta hai
const cors = require('cors')
// Ye Express ka app object banata hai jisse backend server banaya jata hai.
const app = express()
// CORS on kiya - taaki frontend se request aasake
app.use(cors())
// json - data ko readable formate me convert kar deta h
app.use(express.json())

// .env file me stored MongoDB URL ka use karke database se connect karta hai.
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err))
// api/auth/register - Backend API ke authentication section me jao aur register wala kaam karo
  app.use('/api/auth', authRoutes)
// /api/posts/create - posts section me create post karo.
  app.use('/api/posts', postRoutes)
// /api/hello - sample Hello World API
  app.use('/api/hello', helloRoutes)

app.get('/', (req, res) => {
  res.send('Blog API Running')
})

app.listen(5000, () => {
  console.log('Server running')
})