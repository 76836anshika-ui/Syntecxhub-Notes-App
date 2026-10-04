import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  // ---------------- NAVIGATION ----------------
  const [currentPage, setCurrentPage] = useState("home");

  // ---------------- NOTES ----------------
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [aiSummary, setAiSummary] = useState("");

  // Load notes from localStorage
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");

    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [editingId, setEditingId] = useState(null);

  // Reference for title input
  const titleInputRef = useRef(null);

  // Focus input when Notes page opens
  useEffect(() => {
    if (
      currentPage === "notes" &&
      titleInputRef.current
    ) {
      titleInputRef.current.focus();
    }
  }, [currentPage]);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // ---------------- ADD NOTE ----------------
  const addNote = () => {
    if (
      noteTitle.trim() === "" ||
      noteContent.trim() === ""
    ) {
      alert("Please enter both title and note content.");
      return;
    }

    const newNote = {
      id: Date.now(),
      title: noteTitle,
      content: noteContent,
      date: new Date().toLocaleDateString(),
    };

    setNotes([...notes, newNote]);

    setNoteTitle("");
    setNoteContent("");
  };

  // ---------------- DELETE NOTE ----------------
  const deleteNote = (id) => {
    const updatedNotes = notes.filter(
      (note) => note.id !== id
    );

    setNotes(updatedNotes);
  };

  // ---------------- EDIT NOTE ----------------
  const editNote = (id) => {
    const noteToEdit = notes.find(
      (note) => note.id === id
    );

    if (!noteToEdit) return;

    setNoteTitle(noteToEdit.title);
    setNoteContent(noteToEdit.content);
    setEditingId(id);

    titleInputRef.current.focus();
  };

  // ---------------- UPDATE NOTE ----------------
  const updateNote = () => {
    if (
      noteTitle.trim() === "" ||
      noteContent.trim() === ""
    ) {
      alert("Please enter both title and note content.");
      return;
    }

    const updatedNotes = notes.map((note) =>
      note.id === editingId
        ? {
            ...note,
            title: noteTitle,
            content: noteContent,
          }
        : note
    );

    setNotes(updatedNotes);

    setNoteTitle("");
    setNoteContent("");
    setEditingId(null);
  };

  // ---------------- CANCEL EDIT ----------------
  const cancelEdit = () => {
    setNoteTitle("");
    setNoteContent("");
    setEditingId(null);
  };

  // ---------------- AI SUMMARY ----------------
  const summarizeNote = async () => {
  if (noteContent.trim() === "") {
    alert("Please write a note first.");
    return;
  }

  try {
    setAiSummary("✨ Generating AI summary...");

    const response = await fetch("http://localhost:5000/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note: noteContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    setAiSummary(data.summary);
  } catch (error) {
    console.error(error);
    setAiSummary("❌ Unable to generate summary. Please try again.");
  }
};

 

    
  // ---------------- SEARCH NOTES ----------------
  const filteredNotes = notes.filter(
    (note) =>
      note.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      note.content
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">

      {/* ================= NAVIGATION BAR ================= */}

      <nav className="navbar">

        <div
          className="logo"
          onClick={() => setCurrentPage("home")}
        >
          📝 NoteFlow
        </div>

        <div className="nav-links">

          <button
            onClick={() => setCurrentPage("home")}
          >
            🏠 Home
          </button>

          <button
            onClick={() => setCurrentPage("notes")}
          >
            📝 My Notes
          </button>

          <button
            onClick={() => setCurrentPage("ai")}
          >
            🤖 AI Assistant
          </button>

          <button
            onClick={() => setCurrentPage("about")}
          >
            ℹ️ About
          </button>

        </div>

      </nav>


      {/* =====================================================
                         HOME PAGE
      ===================================================== */}

      {currentPage === "home" && (

        <section className="home-page">

          <div className="hero-content">

            <span className="hero-badge">
              ✨ Smart & Simple Note Taking
            </span>

            <h1>
              Organize Your
              <span> Thoughts </span>
              Beautifully
            </h1>

            <p>
              Write, organize and manage your thoughts
              with a simple and smart notes application.
            </p>

            <button
              className="get-started-btn"
              onClick={() => setCurrentPage("notes")}
            >
              Get Started →
            </button>

          </div>


          {/* FEATURES */}

          <div className="features">

            <div className="feature-card">

              <div className="feature-icon">
                📝
              </div>

              <h3>Easy Notes</h3>

              <p>
                Create, edit and organize your
                notes easily.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                🤖
              </div>

              <h3>AI Assistant</h3>

              <p>
                Summarize your notes .
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                💾
              </div>

              <h3>Auto Save</h3>

              <p>
                Your notes are saved automatically
                in your browser.
              </p>

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
                         MY NOTES PAGE
      ===================================================== */}

      {currentPage === "notes" && (

        <section className="notes-page">

          <div className="page-heading">

            <h1>📝 My Notes</h1>

            <p>
              Create and organize your personal notes.
            </p>

          </div>


          {/* INPUT SECTION */}

          <section className="note-input-section">

            <input
              ref={titleInputRef}
              type="text"
              placeholder="Enter note title..."
              value={noteTitle}
              onChange={(e) =>
                setNoteTitle(e.target.value)
              }
            />

            <textarea
              placeholder="Write your note here..."
              rows="5"
              maxLength="500"
              value={noteContent}
              onChange={(e) =>
                setNoteContent(e.target.value)
              }
            />

            <p className="character-count">
              {noteContent.length}/500 characters
            </p>


            {editingId === null ? (

              <button onClick={addNote}>
                ➕ Add Note
              </button>

            ) : (

              <div className="edit-actions">

                <button onClick={updateNote}>
                  ✓ Update Note
                </button>

                <button
                  className="cancel-btn"
                  onClick={cancelEdit}
                >
                  ✕ Cancel
                </button>

              </div>

            )}

          </section>


          {/* NOTES LIST */}

          <section className="notes-section">

            <div className="notes-title">

              <h2>
                My Notes
              </h2>

              <span>
                {notes.length} Notes
              </span>

            </div>


            {/* SEARCH */}

            {notes.length > 0 && (

              <input
                type="text"
                className="search-input"
                placeholder="🔍 Search your notes..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            )}


            {/* EMPTY STATE */}

            {notes.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  📝
                </div>

                <h3>
                  No notes yet
                </h3>

                <p>
                  Start by creating your first note!
                </p>

              </div>

            ) : filteredNotes.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  🔍
                </div>

                <h3>
                  No matching notes
                </h3>

                <p>
                  Try searching with a different word.
                </p>

              </div>

            ) : (

              <div className="notes-container">

                {filteredNotes.map((note) => (

                  <div
                    className="note-card"
                    key={note.id}
                  >

                    <div className="note-header">

                      <h3>
                        {note.title}
                      </h3>

                      <span>
                        {note.date}
                      </span>

                    </div>

                    <p>
                      {note.content}
                    </p>


                    <div className="note-actions">
  <button className="edit-btn" onClick={() => editNote(note)}>
    ✏️ Edit
  </button>

  <button className="delete-btn" onClick={() => deleteNote(note.id)}>
    🗑️ Delete
  </button>


                     

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </section>

      )}


      {/* =====================================================
                       AI ASSISTANT PAGE
      ===================================================== */}

      {currentPage === "ai" && (

        <section className="ai-page">

          <div className="page-heading">

            <h1>🤖 AI Notes Assistant</h1>

            <p>
              Make your notes smarter with AI-powered tools.
            </p>

          </div>


          <div className="ai-section">

            <h2>
              ✨ Smart Note Tools
            </h2>

            <p>
              Write your note below and use the AI
              tools to summarize it .
            </p>


            <textarea
              className="ai-textarea"
              placeholder="Write or paste your note here..."
              rows="7"
              value={noteContent}
              onChange={(e) =>
                setNoteContent(e.target.value)
              }
            />


            <div className="ai-buttons">

              <button
                className="ai-btn"
                onClick={summarizeNote}
              >
                ✨ Summarize Note
              </button>

             
            </div>


            <div className="ai-result">

              <h3>
                💡 AI Summary
              </h3>

              <p>
                {aiSummary ||
                  "Your AI-generated summary will appear here."}
              </p>

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
                           ABOUT PAGE
      ===================================================== */}

      {currentPage === "about" && (

        <section className="about-page">

          <div className="page-heading">

            <h1>
              ℹ️ About NoteFlow
            </h1>

            <p>
              A simple, modern and smart notes
              management application.
            </p>

          </div>


          <div className="about-card">

            <h2>
              What is NoteFlow?
            </h2>

            <p>
              NoteFlow is a web-based notes application
              designed to help users write, organize,
              search and manage their everyday thoughts
              and important information.
            </p>


            <h2>
              🛠️ Technologies Used
            </h2>

            <div className="tech-list">

              <span>HTML</span>
              <span>CSS</span>
              <span>JavaScript</span>
              <span>React</span>
              <span>LocalStorage</span>
              <span>AI</span>

            </div>

          </div>

        </section>

      )}

    </div>
  );
}

export default App;