import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      localStorage.setItem('token', response.data.token)
      navigate('/')
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Invalid Credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-4">
      <div className="bg-[#1e293b]/60 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-slate-400 mt-2 text-sm">Initialize your session to post articles</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="developer@syntax.io"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-200 placeholder-slate-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-200 placeholder-slate-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors uppercase tracking-wider"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-600/10 mt-2 disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          New to the platform?{' '}
          <button onClick={() => navigate('/register')} className="text-blue-400 font-semibold hover:underline">
            Register here
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login