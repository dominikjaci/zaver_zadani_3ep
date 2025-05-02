const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const notesPath = path.join(__dirname, '../data/notes.json');

// Získávání poznámek
router.get('/', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(notesPath));
  res.json({ notes }); // Vrací objekt s klíčem 'notes'
});

// Přidání poznámky
router.post('/', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(notesPath));
  const newNote = {
    id: Date.now(),
    text: req.body.text // Ukládá text poznámky
  };
  notes.push(newNote);
  fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));
  res.status(201).json(newNote);
});

module.exports = router;