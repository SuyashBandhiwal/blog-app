// notFound - jab koi bhi route match nahi hota (galat URL), 404 bhej ke error ko aage pass karta hai
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// errorHandler - app me kahin se bhi throw/next(err) hua error yahan aakar catch hota hai.
// Ye Express ka LAST middleware hona chahiye (server.js me sabse neeche registered).
const errorHandler = (err, req, res, next) => {
  // Agar kisi controller ne pehle hi status set kiya hai to wahi use karo, warna 500 (server error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // Mongoose "CastError" tab aata hai jab invalid ObjectId di jati hai (e.g. /api/posts/abc123)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message = 'Resource not found'
  }

  // Mongoose duplicate key error (e.g. same email se dobara register)
  if (err.code === 11000) {
    statusCode = 400
    message = 'Duplicate field value entered'
  }

  res.status(statusCode).json({
    message,
    // stack trace sirf development me bhejo, production me chhupa do (security)
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  })
}

module.exports = { notFound, errorHandler }
