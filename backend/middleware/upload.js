const multer = require('multer')
const path = require('path')
const fs = require('fs')

// uploads/ folder banao agar exist nahi karti (backend root ke andar)
const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// NOTE: Ye simple DISK storage hai (local file system pe save hota hai).
// Production/cloud deploy (Render/Vercel jaisi services) me disk ephemeral hoti hai,
// isliye real project me isko Cloudinary/S3 se replace karna better hai -
// bas yahan `storage` ko multer-storage-cloudinary se swap karna hoga, baaki code same rahega.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

// Sirf images allow karo, koi bhi random file type nahi (security)
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (jpeg, png, webp, gif) are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
})

module.exports = upload
