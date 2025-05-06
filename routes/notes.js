const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const notesPath = path.join(__dirname, '../data/notes.json');

function getUserId(req) {
  return req.body.userId || req.query.userId;
}

// Získání poznámek
router.get('/', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(notesPath));
  let filteredNotes = notes;
  if (req.query.important === 'true') {
    filteredNotes = filteredNotes.filter(n => n.important);
  }
  // Seřadit od nejnovějších
  filteredNotes.sort((a, b) => new Date(b.created) - new Date(a.created));
  res.json({ notes: filteredNotes });
});

// Přidání poznámky
router.post('/', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(notesPath));
  const { userId, title, text } = req.body;
  if (!userId || !title || !text) {
    return res.status(400).json({ message: 'Chybí některé pole' });
  }
  const newNote = {
    id: Date.now(),
    userId,
    title,
    text,
    created: new Date().toISOString(),
    important: false
  };
  notes.push(newNote);
  fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));
  res.status(201).json(newNote);
});

// Smazání poznámky (pouze autor)
router.delete('/:id', (req, res) => {
  let notes = JSON.parse(fs.readFileSync(notesPath));
  const noteId = Number(req.params.id);
  const userId = req.query.userId;
  const note = notes.find(n => n.id === noteId);
  if (!note || note.userId !== userId) {
    return res.status(403).json({ message: 'Nemáte oprávnění mazat tuto poznámku' });
  }
  notes = notes.filter(n => n.id !== noteId);
  fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));
  res.json({ success: true });
});

// Úprava poznámky (pouze autor)
router.put('/:id', (req, res) => {
  let notes = JSON.parse(fs.readFileSync(notesPath));
  const noteId = Number(req.params.id);
  const { userId, title, text } = req.body;
  const note = notes.find(n => n.id === noteId);
  if (!note || note.userId !== userId) {
    return res.status(403).json({ message: 'Nemáte oprávnění upravit tuto poznámku' });
  }
  if (!title || !text) {
    return res.status(400).json({ message: 'Chybí některé pole' });
  }
  note.title = title;
  note.text = text;
  fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));
  res.json(note);
});

// Označení důležitosti (pouze autor)
// Označení důležitosti (kdokoliv může)
router.patch('/:id/important', (req, res) => {
  let notes = JSON.parse(fs.readFileSync(notesPath));
  const noteId = Number(req.params.id);
  const { important } = req.body;
  const note = notes.find(n => n.id === noteId);
  if (!note) {
    return res.status(404).json({ message: 'Poznámka nenalezena' });
  }
  note.important = important;
  fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));
  res.json(note);
});

module.exports = router;