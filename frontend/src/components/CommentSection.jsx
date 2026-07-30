import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

// Naya (v2): Comments - click karke expand hote hain, taaki feed clutter na ho
function CommentSection({ postId }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)

  const loadComments = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/api/posts/${postId}/comments`)
      setComments(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleOpen = () => {
    const willOpen = !open
    setOpen(willOpen)
    if (willOpen && comments.length === 0) loadComments()
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setPosting(true)
    try {
      const { data } = await api.post(`/api/posts/${postId}/comments`, { text })
      setComments((prev) => [data, ...prev])
      setText('')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment')
    } finally {
      setPosting(false)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/api/posts/comments/${commentId}`)
      setComments((prev) => prev.filter((c) => c._id !== commentId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  return (
    <div className="mt-3">
      <button
        onClick={toggleOpen}
        className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
      >
        {open ? 'Hide comments' : `Comments (${comments.length || ''})`}
      </button>

      {open && (
        <div className="mt-3 space-y-3 border-t border-slate-800/60 pt-3">
          {user && (
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-1.5 bg-[#0f172a] border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={posting}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg disabled:opacity-50"
              >
                Post
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-xs text-slate-500">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-slate-500">No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="flex justify-between items-start text-sm">
                <p className="text-slate-300">
                  <span className="font-semibold text-slate-200">@{c.author?.name || 'user'}</span>{' '}
                  <span className="text-slate-400">{c.text}</span>
                </p>
                {user?.id === c.author?._id && (
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-xs text-slate-500 hover:text-red-400 ml-2 shrink-0"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default CommentSection
