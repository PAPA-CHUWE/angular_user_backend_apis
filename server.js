const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'src', 'db', 'Users.json');

app.use(cors());
app.use(express.json());

app.post('/api/users/create-user', (req, res) => {
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


app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
