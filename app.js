const express = require('express');
const app = express();
const path = require('path');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server běží na http://localhost:${PORT}`);
});