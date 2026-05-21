const express = require('express')
//Ye ek mini route manager banata hai
const router = express.Router()
// authController file se:register function, login function import karta hai
const { register , login } = require('../controllers/authController')
// Route bas request receive karta hai, Actual kaam controller karta hai 
// POST request aane par register function chalata hai
router.post('/register', register)
// Agar request aaye: /api/auth/login - login function chalega
router.post('/login', login)
// Ye router ko export karta hai taaki dusri file me use kar sake
module.exports = router
