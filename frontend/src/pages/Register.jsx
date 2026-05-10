import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    await axios.post('https://blog-app-backend-ndv9.onrender.com/api/auth/register', {
      name,
      email,
      password
    })
    navigate('/login')
  }

  return (
    <div>
      <h2>Register</h2>
      <input type="text" placeholder="Name"
        value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email"
        value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password"
        value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  )
}

export default Register