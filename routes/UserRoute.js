import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to Users.json
const USERS_FILE = path.join(__dirname, '..', 'db', 'Users.json');

router.post('/create-user', (req, res) => {
  const newUser = req.body;

  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading user file' });

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ message: 'Invalid JSON format in user file' });
    }

    users.push(newUser);

    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).json({ message: 'Failed to save user' });
      return res.status(200).json({ message: 'User saved successfully' });
    });
  });
});

export default router;
