const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid'); // For generating unique IDs

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Route to serve notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route to get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile('db.json', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// API route to post a new note
app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuid.v4() }; // Add unique ID to the new note

  fs.readFile('db.json', (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile('db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

// API route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile('db.json', (err, data) => {
    if (err) throw err;

    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);

    fs.writeFile('db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) throw err;
      res.status(204).end(); // No content to return
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
