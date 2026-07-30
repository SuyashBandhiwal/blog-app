import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { user, logout } = useAuth() // UPGRADE (v2): localStorage ki jagah AuthContext

  const fetchPosts = useCallback(async (pageNum, searchTerm, append = false) => {
    append ? setLoadingMore(true) : setLoading(true)
    try {
      // UPGRADE (v2): hardcoded 'http://localhost:5000' hataya - api instance env se URL leta hai.
      // Pagination + search bhi ab support hai.
      const { data } = await api.get('/api/posts', {
        params: { page: pageNum, limit: 5, search: searchTerm || undefined }
      })
      setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts))
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(1, search)
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage, search, true)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handlePostDeleted = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id))
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      {/* Navbar */}
      <nav className="bg-[#1e293b]/80 border-b border-slate-800 px-6 py-4 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tight text-blue-400 cursor-pointer flex items-center" onClick={() => navigate('/')}>
            Syntax<span className="text-slate-100 bg-blue-500/25 border border-blue-500/40 px-2 py-0.5 rounded-lg text-sm font-semibold ml-1.5 shadow-sm">Share</span>
          </h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate(`/profile/${user.id}`)}
                  className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                >
                  @{user.name}
                </button>
                <button
                  onClick={() => navigate('/create')}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
                >
                  + New Post
                </button>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-400 hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Feed */}
      <div className="max-w-3xl mx-auto py-10 px-4">
        {/* Naya (v2): Search bar */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts by title or content..."
            className="w-full px-4 py-2.5 bg-[#1e293b]/60 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 placeholder-slate-500"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm">Fetching fresh logs...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center bg-[#1e293b]/40 border border-dashed border-slate-700 rounded-2xl p-12">
            <p className="text-slate-400 mb-4">No data streams found. Start the conversation!</p>
            <button onClick={() => navigate('/create')} className="text-blue-400 font-medium hover:underline">Write code &rarr;</button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} onDeleted={handlePostDeleted} />
              ))}
            </div>

            {/* Naya (v2): pagination - "Load more" button jab tak next page bache hain */}
            {page < totalPages && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-5 py-2.5 bg-[#1e293b] border border-slate-700 hover:border-blue-500 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
