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

// Utility: read users from file
const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data || '[]');
};

// Utility: write users to file
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// CREATE
router.post('/create-user', (req, res) => {
  try {
    const users = readUsers();
    const { email } = req.body;

    // Check if email already exists
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const newUser = { ...req.body, id: Date.now().toString() };
    users.push(newUser);
    writeUsers(users);
    res.status(200).json({ message: 'User saved successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
});


// READ ALL
router.get('/all-users', (req, res) => {
  try {
    const users = readUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to read users', error: err.message });
  }
});

// READ ONE
router.get('/user/:id', (req, res) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

// UPDATE
router.put('/update-user/:id', (req, res) => {
  try {
    const users = readUsers();
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'User not found' });

    users[index] = { ...users[index], ...req.body };
    writeUsers(users);
    res.json({ message: 'User updated successfully', user: users[index] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

// DELETE
router.delete('/delete-user/:id', (req, res) => {
  try {
    const users = readUsers();
    const updatedUsers = users.filter(u => u.id !== req.params.id);
    if (users.length === updatedUsers.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    writeUsers(updatedUsers);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

export default router;
