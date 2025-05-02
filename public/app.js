const express = require('express');
const app = express();
const path = require('path');

// Opravená cesta k auth routes
const authRoutes = require('../routes/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nastavení statických souborů - ukazuje na složku public
app.use(express.static(__dirname));

// Použití auth routes
app.use('/auth', authRoutes);

// Základní route pro index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Spuštění serveru
app.listen(3000, () => {
  console.log('✅ Server běží na http://localhost:3000');
});