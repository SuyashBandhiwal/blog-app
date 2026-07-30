import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

// UPGRADE (v2): Pehle har page me `localStorage.getItem('token')` repeat ho raha tha,
// aur "kaun logged in hai" ka koi central jagah nahi tha (author bhi hardcoded 'Suyash' tha).
// Ab AuthContext ek hi jagah se "current user" ka state deta hai, poore app me.
// Token ab localStorage me nahi (XSS-unsafe), httpOnly cookie me hai - JS use read hi nahi kar sakta,
// isliye "kaun login hai" pata karne ke liye backend se /api/auth/me poochna padta hai.
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // app load hote hi session check chal raha hai

  // App mount hote hi ek baar check karo: cookie valid hai to /me user data de dega
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get('/api/auth/me')
        setUser(data.user)
      } catch {
        setUser(null) // cookie nahi hai ya expire ho gayi - normal case, error nahi hai
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    setUser(data.user)
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    setUser(data.user)
  }

  const logout = async () => {
    await api.post('/api/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook - components me `const { user } = useAuth()` jaise use hota hai
export const useAuth = () => useContext(AuthContext)
