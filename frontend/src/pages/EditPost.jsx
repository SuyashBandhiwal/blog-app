import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

// Naya (v2): Pehle backend me updatePost/deletePost already the, lekin frontend me
// koi edit UI hi nahi thi. Ye page wahi gap fill karta hai.
function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notFoundOrForbidden, setNotFoundOrForbidden] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Abhi ek single-post GET endpoint nahi hai, isliye list se filter kar rahe hain.
        // (Bade app me /api/posts/:id ka dedicated route banana better hota)
        const { data } = await api.get('/api/posts', { params: { limit: 50 } })
        const post = data.posts.find((p) => p._id === id)

        if (!post) {
          setNotFoundOrForbidden(true)
          return
        }
        // Client-side pe bhi ownership check - sirf UX ke liye (real security check backend pe hai)
        if (post.author?._id !== user?.id) {
          setNotFoundOrForbidden(true)
          return
        }

        setTitle(post.title)
        setContent(post.content)
        setExistingImage(post.image)
      } catch (err) {
        console.error(err)
        setNotFoundOrForbidden(true)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id, user])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      if (image) formData.append('image', image)

      await api.put(`/api/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigate('/')
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Failed to update post')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (notFoundOrForbidden) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-slate-400">You can't edit this post (not found or not yours).</p>
        <button onClick={() => navigate('/')} className="text-blue-400 hover:underline">Go back home</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-4">
      <div className="bg-[#1e293b]/60 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800 p-8 w-full max-w-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Edit Post
          </h2>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Post Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Content</label>
            <textarea
              rows="6"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Cover Image {existingImage && '(leave empty to keep current)'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-500 file:cursor-pointer cursor-pointer"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 font-medium transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all text-sm disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPost
