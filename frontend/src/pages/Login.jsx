import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    const response = await axios.post('https://blog-app-backend-ndv9.onrender.com/api/auth/login', {
      email,
      password
    })
    localStorage.setItem('token', response.data.token)
    navigate('/')
  }

  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email"
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password"
        value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login