// StrictMode - Code me mistakes/problems detect karne me help karta hai
import { StrictMode } from 'react'
// createRoot - React UI ko HTML page me inject karta hai
import { createRoot } from 'react-dom/client'
// BrowserRouter - Page navigation system ON karta hai
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// HTML file me: <div id="root"></div>
// .render( - React UI ko render/show karta hai
createRoot(document.getElementById('root')).render(
  // App ko strict checking mode me wrap karta hai (extra checking)
  <StrictMode>
    {/* Pure app ko routing support deta hai */}
    <BrowserRouter>
    {/* Main App component render karta hai */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)