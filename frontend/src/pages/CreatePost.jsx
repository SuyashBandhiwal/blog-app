import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  const handleCreate = async () => {
    const token = localStorage.getItem('token')
  await axios.post(
  `${import.meta.env.VITE_API_URL}/api/posts`,
  { title, content, author: 'Suyash' },
  { headers: { Authorization: token } }
)
    navigate('/')
  }

  return (
    <div>
      <h2>Create Post</h2>
      <input type="text" placeholder="Title"
        value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Content"
        value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleCreate}>Create Post</button>
    </div>
  )
}

export default CreatePost