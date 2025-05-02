const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const dataPath = path.join(__dirname, '../data/users.json');

function readUsers() {
    if (!fs.existsSync(dataPath)) return [];
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
}

function writeUsers(users) {
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

function findUserByUsername(username) {
    const users = readUsers();
    return users.find(u => u.username === username);
}

function createUser(username, password) {
    const users = readUsers();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
}

module.exports = {
    readUsers,
    writeUsers,
    findUserByUsername,
    createUser
};
