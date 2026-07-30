import axios from 'axios'

// UPGRADE (v2): Ek hi jagah se baseURL set hota hai (pehle har page me
// 'http://localhost:5000' hardcoded tha, isliye production/deployed build kabhi kaam
// nahi karta tha). Ab .env ki VITE_API_URL use hoti hai.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  // withCredentials zaroori hai taaki httpOnly cookie (JWT) automatically
  // har request ke saath backend ko bheji/receive ki ja sake
  withCredentials: true
})

export default api
