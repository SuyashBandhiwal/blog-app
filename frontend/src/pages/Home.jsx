import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(response => {
        setPosts(response.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
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
            {localStorage.getItem('token') ? (
              <>
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
          <div className="space-y-6">
            {posts.map(post => (
              <article key={post._id} className="bg-[#1e293b]/40 rounded-2xl p-6 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#1e293b]/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold uppercase shadow-inner">
                    {post.author ? post.author[0] : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">@{post.author || 'anonymous'}</p>
                    <p className="text-xs text-slate-500">Just now</p>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-slate-100 mb-2 leading-snug hover:text-blue-400 transition-colors cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-slate-400 leading-relaxed whitespace-pre-line text-[15px]">{post.content}</p>
                
                <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="bg-slate-800/80 text-blue-400 border border-slate-700 px-2.5 py-1 rounded-md font-mono">console.log()</span>
                  <span>MERN Stack</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home