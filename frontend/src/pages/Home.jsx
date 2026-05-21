import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(response => setPosts(response.data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">BlogApp</h1>
        <button
          onClick={() => navigate('/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Post
        </button>
      </nav>
      <div className="max-w-3xl mx-auto py-8 px-4">
        {posts.map(post => (
          <div key={post._id} className="bg-white rounded-xl shadow-sm p-6 mb-4 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
            <p className="text-gray-600">{post.content}</p>
            <p className="text-sm text-blue-500 mt-3">By {post.author}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home