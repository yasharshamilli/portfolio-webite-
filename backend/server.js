// Simple Express backend for contact form submissions and admin panel
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'contacts.json');

app.use(cors());
app.use(express.json());

// Get all contact messages
app.get('/api/contacts', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json([]);
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  res.json(JSON.parse(data || '[]'));
});

// Add a new contact message
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields required' });
  let contacts = [];
  if (fs.existsSync(DATA_FILE)) {
    contacts = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || '[]');
  }
  const newContact = { name, email, message, date: new Date().toISOString() };
  contacts.push(newContact);
  fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2));
  res.status(201).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
