import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return alert('Please fill in all fields')

    setIsLoading(true)
    try {
      // UPGRADE (v2): author hardcoded 'Suyash' hata diya - backend ab
      // logged-in user ki ID token/cookie se khud nikalta hai.
      // FormData use kiya kyunki image bhi bhejni ho sakti hai (multipart/form-data)
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      if (image) formData.append('image', image)

      await api.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigate('/')
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Failed to create post')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-4">
      <div className="bg-[#1e293b]/60 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800 p-8 w-full max-w-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Create a New Post
          </h2>
          <p className="text-slate-400 text-sm mt-1">Share your logic, bugs, or stories with the dev community.</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Post Title</label>
            <input
              type="text"
              placeholder="e.g., Mastering the MERN Stack API"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-200 placeholder-slate-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-300">Content</label>
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{content.length} chars</span>
            </div>
            <textarea
              rows="6"
              placeholder="Write your markdown or text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-200 placeholder-slate-500 resize-none"
            />
          </div>

          {/* Naya (v2): optional cover image upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Cover Image (optional)</label>
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
              disabled={isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all text-sm disabled:opacity-50"
            >
              {isLoading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
