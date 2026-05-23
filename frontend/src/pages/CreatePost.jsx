 // React ka useState hook import karta hai
 // usestate - Temporary data store karne ke liye use hota hai 

import { useState } from 'react'
// axios - Frontend ↔ Backend communication
import axios from 'axios'
// Ek page se dusre page pe bhejta hai
import { useNavigate } from 'react-router-dom'

// React component bana raha hai
// UI ka reusable piece/page
function CreatePost() {
  //Title input ko store karta hai
  // title - current value
  // setTitle - value update karega
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  //Ek page se dusre page pe bhejne ke liye
  const navigate = useNavigate()

 // Create Post button click hone par ye function chalega
 // Ye kab chalega? - Usually button click par: <button onClick={handleCreate}>
  const handleCreate = async () => {
    //Browser me saved JWT token nikalta hai
    // localStorage - Browser ki permanent memory(Login ke time token save hua tha)
    const token = localStorage.getItem('token')
    // Backend ko POST request bhejta hai - nayi post create karni hai
    await axios.post(
      // Backend API endpoint
      // localhost - tumhara computer
      // 5000 - backend server port
      // /api/posts - create post route
      'http://localhost:5000/api/posts',
      // Backend ko data bhejta hai
      { title, content, author: 'Suyash' },
      // Request ke headers me token bhejta hai
      // headers - Extra information
      { headers: { Authorization: token } }
    )
    // User ko home page pe bhej deta hai - Jab post successfully create ho jaye
    navigate('/')
  }
  // UI return karta hai - React component user ko kya dikhayega
  // Agar return nahi hoga - screen pe kuch render nahi hoga
  return (
    <div>
      <h2>Create Post</h2>
       {/* Text input field banata hai */}
      <input type="text" placeholder="Title"
      // value={title} - Input ki current value ko React state se connect karta hai
      // onChange={(e) => setTitle(e.target.value)} - User jo type kare usse state update karta hai
       // e - Event object
       // e.target - Jis input me typing hui
       // e.target.value - User ne jo likha
       // setTitle() - Title state update karta hai
       // Agar onChange nahi lagate tho - input editable nahi hota
       value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Content"
        value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleCreate}>Create Post</button>
    </div>
  )
}

export default CreatePost