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
    <div>
      <h2>Blog Posts</h2>
      <button onClick={() => navigate('/create')}>New Post</button>
      {posts.map(post => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  )
}

export default Home