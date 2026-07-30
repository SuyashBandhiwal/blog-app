import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import CommentSection from './CommentSection'

// Naya (v2): Home.jsx me sab kuch inline likha tha, ab har post ka rendering yahan
// alag component me hai - likes, edit/delete (ownership check), comments sab isi me hain.
function PostCard({ post, onDeleted }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0)
  const [liked, setLiked] = useState(user ? post.likes?.includes(user.id) : false)
  const [deleting, setDeleting] = useState(false)

  const isOwner = user && post.author && user.id === post.author._id

  const handleLike = async () => {
    if (!user) return navigate('/login')
    try {
      const { data } = await api.put(`/api/posts/${post._id}/like`)
      setLikesCount(data.likesCount)
      setLiked(data.liked)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    setDeleting(true)
    try {
      await api.delete(`/api/posts/${post._id}`)
      onDeleted(post._id)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post')
    } finally {
      setDeleting(false)
    }
  }

  const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:5000')

  return (
    <article className="bg-[#1e293b]/40 rounded-2xl p-6 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#1e293b]/60">
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => post.author && navigate(`/profile/${post.author._id}`)}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold uppercase shadow-inner">
            {post.author?.name ? post.author.name[0] : 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200 hover:text-blue-400">@{post.author?.name || 'anonymous'}</p>
            <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Naya (v2): Edit/Delete sirf post ke owner ko dikhte hain */}
        {isOwner && (
          <div className="flex gap-3 text-xs">
            <button onClick={() => navigate(`/edit/${post._id}`)} className="text-slate-400 hover:text-blue-400">
              Edit
            </button>
            <button onClick={handleDelete} disabled={deleting} className="text-slate-400 hover:text-red-400 disabled:opacity-50">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold text-slate-100 mb-2 leading-snug">{post.title}</h2>

      {post.image && (
        <img
          src={`${apiOrigin}${post.image}`}
          alt={post.title}
          className="rounded-xl mb-3 max-h-80 w-full object-cover"
        />
      )}

      <p className="text-slate-400 leading-relaxed whitespace-pre-line text-[15px]">{post.content}</p>

      <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
        {/* Naya (v2): Like button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors ${
            liked ? 'text-blue-400 border-blue-500/40 bg-blue-500/10' : 'border-slate-700 hover:text-blue-400'
          }`}
        >
          ♥ {likesCount}
        </button>
        
      </div>

      {/* Naya (v2): Comments */}
      <CommentSection postId={post._id} />
    </article>
  )
}

export default PostCard
