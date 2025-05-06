const express = require('express');
const app = express();
const path = require('path');

const authRoutes = require('../routes/auth');
const notesRoutes = require('../routes/notes'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
  console.log('✅ Server běží na http://localhost:3000');
});