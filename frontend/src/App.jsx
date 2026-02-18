import './index.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {

  const [notes, setNotes] = useState([])
  const [favorites, setFavorites] = useState({})

  /* //yaha axios use krenge kuki ye backend ka data frontend me leker ane me help krega , or sath hi jis bhi api ki method chahiye hai usko axios ke aage . lga kar likh do such as get,post,delete  */
  function fetchNotes() {
    axios.get('https://fullstack-note-taking-app.onrender.com/api/notes')
      .then((res) => {
        setNotes(res.data.notes)
      })
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  function submitHandler(e) {
    e.preventDefault()
    const { title, description } = e.target.elements

    /* Post for create => */
    axios.post("https://fullstack-note-taking-app.onrender.com/api/notes", {
      title: title.value,
      description: description.value
    })
      .then(() => {
        fetchNotes() //fetchNotes() yaha is liye kara kuki reload karne per data show kar rha tha ui per ab apne se karega and sath me,ye function upar wala chal dega to setNotes ho jayga 
        e.target.reset()
      })
  }

   /* Delete => */
  function handleDeleteNote(noteId) {
    axios.delete("https://fullstack-note-taking-app.onrender.com/api/notes/" + noteId)
      .then(() => {
        fetchNotes()//Refresh na krna pade
      })
  }

  /* PATCH for update the note => */
  const [editNoteId, setEditNoteId] = useState(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedDescription, setEditedDescription] = useState("")

  function handleEditClick(note) {
    setEditNoteId(note._id) // ye note edit mode me aayega
    setEditedTitle(note.title)  // inputs me prefill
    setEditedDescription(note.description)
  }

  function handleSave() {
    axios.patch(`https://fullstack-note-taking-app.onrender.com/api/notes/${editNoteId}`, {
      title: editedTitle,
      description: editedDescription
    }).then(() => {
      fetchNotes()  // fetchNotes() se UI update ho jayega
      setEditNoteId(null) // edit mode close
    })
  }

  function handleCancel() {
    setEditNoteId(null)  // edit mode exit, changes discard
  }

  function toggleFavorite(id) {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  
function getGradient(id) {
  const softGradients = [
    ["#ffe5ec", "#ffd6f0"], 
    ["#e0f7ff", "#c2e7ff"], 
    ["#fff5cc", "#fff0b3"],
    ["#e6ffe6", "#ccffcc"], 
    ["#f0e6ff", "#e0ccff"], 
  ];

 
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % softGradients.length;

  return `linear-gradient(135deg, ${softGradients[index][0]}, ${softGradients[index][1]})`;
}




  return (
    <>
      <form className='note-create-form' onSubmit={submitHandler}>
        <input name='title' type="text" placeholder='Enter Title' required />
        <input name='description' type="text" placeholder='Enter Description' required />
        <button>Create Note</button>
      </form>

      <div className="notes">
        {notes.map(note => (
         <div
  className="note"
  key={note._id}
  style={{ background: getGradient(note._id) }}
>


           
            <div
              className="star"
              onClick={() => toggleFavorite(note._id)}
            >
              {favorites[note._id] ? "⭐" : "☆"}
            </div>

            {editNoteId === note._id ? (
              <>
                <div className="edit-box">
  <input
    type="text"
    value={editedTitle}
    onChange={e => setEditedTitle(e.target.value)}
    placeholder="Edit title"
  />
  <input
    type="text"
    value={editedDescription}
    onChange={e => setEditedDescription(e.target.value)}
    placeholder="Edit description"
  />
  <div className="edit-buttons">
    <button className="save-btn" onClick={handleSave}>Save</button>
    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
  </div>
</div>

              </>
            ) : (
              <>
                <h1>{note.title}</h1>
                <p>{note.description}</p>
                <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
                <button onClick={() => handleEditClick(note)}>Update</button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
