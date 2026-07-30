import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

// Naya (v2): Profile page - kisi bhi author ke saare posts ek jagah dikhata hai
function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuthorPosts = async () => {
      try {
        const { data } = await api.get(`/api/posts/user/${id}`)
        setPosts(data)
        if (data.length > 0) setAuthorName(data[0].author?.name || 'User')
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAuthorPosts()
  }, [id])

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <nav className="bg-[#1e293b]/80 border-b border-slate-800 px-6 py-4 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black text-blue-400 cursor-pointer" onClick={() => navigate('/')}>
            &larr; Back to Feed
          </h1>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold mb-6">
          {authorName ? `@${authorName}'s Posts` : 'Posts'}
        </h2>

        {loading ? (
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        ) : posts.length === 0 ? (
          <p className="text-slate-400">No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post._id} className="bg-[#1e293b]/40 rounded-2xl p-6 border border-slate-800/80">
                <h3 className="text-xl font-bold text-slate-100 mb-2">{post.title}</h3>
                <p className="text-slate-400 whitespace-pre-line text-[15px]">{post.content}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
