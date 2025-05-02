const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.register = (req, res) => {
    const { username, password } = req.body;

    if (User.findUserByUsername(username)) {
        return res.status(400).json({ message: 'Uživatel již existuje' });
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
