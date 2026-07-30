# SyntaxShare v2 — Changes Summary

Is document me wo sab kuch hai jo change hua, kyun hua, aur interview me kaise explain karna hai.

---

## ⚠️ Setup karne se pehle (zaroori steps)

1. **Backend me naye packages install karo:**
   ```
   cd backend
   npm install
   ```
   (package.json me `cookie-parser`, `helmet`, `express-rate-limit`, `express-validator`, `multer` add kar diye hain)

2. **Frontend:** koi naya package nahi chahiye, bas
   ```
   cd frontend
   npm install
   ```

3. **BREAKING CHANGE — MongoDB data**: `Post` model me `author` field pehle plain `String` tha
   (jaise `"Suyash"`), ab `ObjectId` (User ka reference) hai. Iska matlab:
   - **Purane test posts jo already database me hain, unke saath crash ho sakta hai** (CastError) jab
     tak unhe delete na karo ya manually fix na karo.
   - Sabse aasan: MongoDB Atlas me jaake `posts` collection ko clear kar do, fresh start karo.

4. `.env` files me naye variables check kar lo:
   - `backend/.env` → `FRONTEND_URL` aur `NODE_ENV` add hue hain
   - `frontend/.env` → `VITE_API_URL` ab local backend (`http://localhost:5000`) point kar raha hai;
     deploy karte waqt isko apne Render URL se replace karna.

---

## Tier 1 — Fixes & Security

| Kya badla | Kyun |
|---|---|
| Hardcoded `http://localhost:5000` sabhi API calls se hataya, ek central `src/api/axios.js` banaya jo `VITE_API_URL` use karta hai | Production build me API calls hamesha fail ho rahi thi kyuki localhost hi hardcoded tha |
| `CreatePost.jsx` me hardcoded `author: 'Suyash'` hataya | Backend ab token se logged-in user ki asli ID nikaalta hai, koi fake naam nahi bhej sakta |
| Ownership check add kiya (`postController.js` → `updatePost`/`deletePost`) | Pehle koi bhi logged-in user kisi aur ka post edit/delete kar sakta tha |
| `Post.author` ko `String` se `ObjectId (ref: 'User')` banaya | Real relational data — `.populate()` se author ka naam/email fetch hota hai, ownership check reliable ho gaya |
| JWT ab `localStorage` ki jagah **httpOnly cookie** me store hota hai | localStorage JS se readable hai (XSS-vulnerable). httpOnly cookie ko client-side JS chhoo bhi nahi sakti |
| Centralized error handling (`utils/asyncHandler.js` + `middleware/errorMiddleware.js`) | Har controller me try-catch repeat karne ki jagah, ek jagah se saare errors handle hote hain |
| `express-validator` se input validation (register/login/post) | Server-side pe email format & password length (min 6) ab enforce hota hai, pehle sirf UI placeholder tha |
| `helmet` add kiya | Common security headers (clickjacking, MIME sniffing protection) |
| `express-rate-limit` login/register pe | Brute-force password guessing attempts limit ho gaye (10 attempts / 10 min) |
| CORS ab sirf `FRONTEND_URL` allow karta hai (pehle `*` — koi bhi site) | Cookie-based auth ke saath open CORS khatarnak hai; ab `credentials: true` + specific origin |

## Tier 2 — Features

| Feature | Kahan |
|---|---|
| Edit/Delete UI | `PostCard.jsx` (owner ko dikhta hai) + naya `EditPost.jsx` page |
| Pagination | `postController.js` → `getAllPosts` (`page`, `limit` query params) + Home.jsx me "Load More" button |
| Search | MongoDB text index (`Post.js`) + Home.jsx me search bar |
| Comments | Naya `Comment` model + `commentController.js` + `CommentSection.jsx` (expand/collapse, add/delete apna comment) |
| Likes | `Post.likes` array + `toggleLike` controller + heart button `PostCard.jsx` me |
| Profile page | `getPostsByAuthor` controller + naya `Profile.jsx` page (author ke naam pe click karke jaa sakte ho) |
| Image upload | `multer` (local disk storage, `backend/uploads/`) + `CreatePost.jsx`/`EditPost.jsx` me file input |
| Auth Context | Naya `AuthContext.jsx` — poore app me ek hi jagah se `user`, `login()`, `logout()`, `register()` milta hai, `localStorage.getItem` scattered calls hata diye |

---

## Interview Cheat-Sheet (jo tumne khud kiya, wahi bolna hai)

- **"Password kaise secure kiya?"** → bcrypt, salt rounds 10, hash kabhi bhi response me nahi bhejte (`.select('-password')`).
- **"Token kahan store kiya, localStorage kyu nahi?"** → httpOnly cookie, kyunki localStorage JS-readable hai isliye XSS attack se token chori ho sakta tha. Cookie `secure` + `sameSite` flags production me set hote hain.
- **"Agar main dusre ka post delete karne ki koshish karu?"** → 403 milega, kyunki `updatePost`/`deletePost` me `post.author.toString() === req.user._id.toString()` check hota hai.
- **"CORS kyu restrict kiya?"** → cookie-based auth me agar CORS open (`*`) ho aur `credentials: true` ho, to koi bhi malicious site cookie ke saath request bhej sakti hai. Isliye sirf apne frontend ka origin allow kiya.
- **"Rate limiting kyu?"** → login/register pe brute-force / credential-stuffing attacks se bachne ke liye — 10 min me max 10 attempts.
- **"Pagination kaise implement ki?"** → MongoDB `.skip()` + `.limit()`, frontend "Load More" se next page fetch.
- **"Search kaise kaam karta hai?"** → MongoDB text index (`$text: { $search }`) title+content pe.
- **"Image upload production me kaise scale karoge?"** → abhi local disk (multer diskStorage) hai jo demo/learning ke liye theek hai, lekin Render/Vercel jaisi platforms pe disk ephemeral hoti hai — production me Cloudinary/S3 use karna better hoga (bas `storage` config swap karna hoga).
- **"Ownership check client-side ya server-side?"** → Dono. Server-side (`postController.js`) hi real security hai — client-side check (`EditPost.jsx`, `PostCard.jsx` me `isOwner`) sirf UX ke liye hai (button chhupana), kyunki client-side kabhi trust nahi karte security ke liye.

---

## Jo abhi bhi Tier 3 me pending hai (jaan-bujh kar skip kiya)

- Automated tests (Jest/Supertest)
- Docker / docker-compose
- CI/CD pipeline
- Swagger/API docs
- Refresh tokens / RBAC (admin roles)
- README polish + screenshots

Ye sab baad me add kar sakte ho jab time mile — abhi ke liye Tier 1 + Tier 2 resume ke liye kaafi solid hai.
