// App.jsx = Mall Manager (Ye decide karta hai kaunsa page kab dikhana hai)

// Routes = Road Map 
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'

function App() {
  return (
    // Saare routes ko wrap karta hai
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/create" element={<CreatePost/>} />
    </Routes>
  )
}

export default App