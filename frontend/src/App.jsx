// App.jsx = Mall Manager (Ye decide karta hai kaunsa page kab dikhana hai)

// Routes = Road Map 

import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'

// Ek chota sa check component jo token verify karega
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    // Agar token nahi hai to seedha login page pe redirect kar do
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Create route ko ProtectedRoute se wrap kar diya */}
      <Route 
        path="/create" 
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default App