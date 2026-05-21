// JWT package import karta hai
// JWT = JSON Web Token (Ye ek secret identity card hota hai)
const jwt = require('jsonwebtoken')

// Ye middleware function hai -Request ko controller tak jane se pehle check karta hai
const protect = (req, res, next) => {
  // Request ke headers se token nikalta hai
  const token = req.headers.authorization

  // !token - token nahi hai
  // 401 - Unauthorized user (Pehle login karo)
  // Agar ye IF condition hata di -bina login wala banda bhi protected routes access kar sakta hai
  if (!token) {
    return res.status(401).json({
      message: 'No token provided'
    })
  }
  // Token ko verify karta hai -token asli hai ya fake ,secret key sahi hai ya nahi
  // JWT_SECRET - Backend ki secret key (ex- JWT_SECRET=mysecretkey)
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
  )
//  Agar token valid hua, to user data mil jayega - decoded
//   {
//   id: "123",
//   email: "abc@gmail.com"
// }
//  req.user = decoded -User ki information request ke andar store karta hai
// next() - Next middleware/controller ko call karta hai("Sab check ho gaya, ab andar jao.")
  req.user = decoded
  next()
}

module.exports = { protect }