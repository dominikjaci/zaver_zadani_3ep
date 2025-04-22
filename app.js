const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Vítej v databázi poznámek!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
