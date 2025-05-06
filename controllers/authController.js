const bcrypt = require('bcrypt');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, '../data/users.json');

exports.register = (req, res) => {
    const { username, password, consent } = req.body;

    // Kontrola souhlasu
    if (!consent) {
        return res.status(400).json({ message: 'Musíte souhlasit se zpracováním dat.' });
    }

    // Kontrola unikátního uživatelského jména
    if (User.findUserByUsername(username)) {
        return res.status(400).json({ message: 'Uživatel již existuje' });
    }

    // Kontrola unikátního hesla (skrz hash)
    const users = JSON.parse(fs.readFileSync(usersPath));
    const hashedPassword = bcrypt.hashSync(password, 10);
    if (users.some(u => bcrypt.compareSync(password, u.password))) {
        return res.status(400).json({ message: 'Toto heslo již používá jiný uživatel. Zvolte jiné.' });
    }

    const newUser = User.createUser(username, password);
    res.status(201).json({ message: 'Registrace proběhla úspěšně', user: { id: newUser.id, username: newUser.username } });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    const user = User.findUserByUsername(username);
    if (!user) {
        return res.status(400).json({ message: 'Neplatné přihlašovací údaje' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Neplatné přihlašovací údaje' });
    }

    res.status(200).json({ message: 'Přihlášení úspěšné', user: { id: user.id, username: user.username } });
};

// Kontrola hesla a smazání účtu
exports.deleteAccount = async (req, res) => {
    const { userId, password } = req.body;
    const users = JSON.parse(fs.readFileSync(usersPath));
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ message: 'Uživatel nenalezen.' });
    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(403).json({ message: 'Špatné heslo.' });

    const newUsers = users.filter(u => u.id !== userId);
    fs.writeFileSync(usersPath, JSON.stringify(newUsers, null, 2));

    const notesPath = path.join(__dirname, '../data/notes.json');
    let notes = JSON.parse(fs.readFileSync(notesPath));
    notes = notes.filter(n => n.userId !== userId);
    fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));

    res.json({ success: true });
};