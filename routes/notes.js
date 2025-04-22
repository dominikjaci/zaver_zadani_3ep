const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const notesPath = path.join(__dirname, '../data/notes.json');

// Získávání poznámek
router.get('/', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(notesPath));
  res.json(notes);
});

// Přidání poznámek
router.post('/', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(notesPath));
  const newNote = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content
  };
  notes.push(newNote);
  fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));
  res.status(201).json(newNote);
});

module.exports = router;
